"""
Регистрация и вход пользователей (телефон, email, VK, TG).
"""
import json
import os
import hashlib
import secrets
import re
import psycopg2

SCHEMA = "t_p68991375_voicemail_messenger_"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
    "Access-Control-Max-Age": "86400",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    salt = os.environ.get("PASSWORD_SALT", "voicemail_salt_2026")
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(32)


def ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data)}


def err(msg: str, code: int = 400) -> dict:
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg})}


def create_session(conn, user_id: int) -> str:
    token = make_token()
    with conn.cursor() as cur:
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
            (user_id, token)
        )
    conn.commit()
    return token


def get_user_by_token(conn, token: str) -> dict | None:
    with conn.cursor() as cur:
        cur.execute(
            f"""SELECT u.id, u.username, u.display_name, u.email, u.phone, u.vk_id, u.tg_id, u.avatar_url, u.bio
                FROM {SCHEMA}.sessions s
                JOIN {SCHEMA}.users u ON u.id = s.user_id
                WHERE s.token = %s AND s.expires_at > NOW()""",
            (token,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = ["id", "username", "display_name", "email", "phone", "vk_id", "tg_id", "avatar_url", "bio"]
        return dict(zip(cols, row))


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            return err("Invalid JSON")

    token = (event.get("headers") or {}).get("X-Auth-Token", "")

    conn = get_db()

    try:
        # GET /me — получить текущего пользователя по токену
        if method == "GET" and path.endswith("/me"):
            if not token:
                return err("Unauthorized", 401)
            user = get_user_by_token(conn, token)
            if not user:
                return err("Unauthorized", 401)
            return ok({"user": user})

        # POST /register — регистрация
        if method == "POST" and path.endswith("/register"):
            email = body.get("email", "").strip().lower()
            phone = body.get("phone", "").strip()
            vk_id = body.get("vk_id", "").strip()
            tg_id = body.get("tg_id", "").strip()
            password = body.get("password", "")
            display_name = body.get("display_name", "").strip()

            if not display_name:
                return err("Укажи имя")
            if not password and not (vk_id or tg_id):
                return err("Укажи пароль")
            if not (email or phone or vk_id or tg_id):
                return err("Укажи email, телефон, VK или Telegram")

            if email and not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
                return err("Неверный формат email")

            password_hash = hash_password(password) if password else None

            with conn.cursor() as cur:
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.users (email, phone, vk_id, tg_id, password_hash, display_name)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id""",
                    (email or None, phone or None, vk_id or None, tg_id or None, password_hash, display_name)
                )
                user_id = cur.fetchone()[0]
            conn.commit()

            session_token = create_session(conn, user_id)
            return ok({"token": session_token, "user": {"id": user_id, "display_name": display_name, "email": email, "phone": phone}})

        # POST /login — вход
        if method == "POST" and path.endswith("/login"):
            identifier = body.get("identifier", "").strip()
            password = body.get("password", "")

            if not identifier:
                return err("Укажи email или телефон")

            password_hash = hash_password(password) if password else None
            identifier_lower = identifier.lower()

            with conn.cursor() as cur:
                cur.execute(
                    f"""SELECT id, display_name, email, phone, vk_id, tg_id, avatar_url
                        FROM {SCHEMA}.users
                        WHERE (LOWER(email) = %s OR phone = %s OR vk_id = %s OR tg_id = %s)
                          AND (password_hash = %s OR (password_hash IS NULL AND %s IS NULL))""",
                    (identifier_lower, identifier, identifier, identifier, password_hash, password_hash)
                )
                row = cur.fetchone()

            if not row:
                return err("Неверный логин или пароль", 401)

            cols = ["id", "display_name", "email", "phone", "vk_id", "tg_id", "avatar_url"]
            user = dict(zip(cols, row))
            session_token = create_session(conn, user["id"])
            return ok({"token": session_token, "user": user})

        # POST /logout — выход
        if method == "POST" and path.endswith("/logout"):
            if token:
                with conn.cursor() as cur:
                    cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
                conn.commit()
            return ok({"ok": True})

        return err("Not found", 404)

    finally:
        conn.close()
