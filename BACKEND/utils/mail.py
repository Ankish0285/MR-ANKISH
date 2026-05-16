import os
import smtplib
from email.message import EmailMessage


def send_contact_email(*, name: str, email: str, message: str) -> None:
    host = os.getenv("MAIL_SERVER")
    user = os.getenv("MAIL_USERNAME")
    password = os.getenv("MAIL_PASSWORD")
    to_addr = os.getenv("MAIL_TO") or user
    port = int(os.getenv("MAIL_PORT") or "587")
    use_tls = os.getenv("MAIL_USE_TLS", "true").lower() in ("1", "true", "yes")

    if not host or not to_addr:
        return

    msg = EmailMessage()
    msg["Subject"] = f"MR ANKISH — message from {name}"
    msg["From"] = user or to_addr
    msg["To"] = to_addr
    msg.set_content(f"From: {name} <{email}>\n\n{message}")

    with smtplib.SMTP(host, port, timeout=30) as smtp:
        if use_tls:
            smtp.starttls()
        if user and password:
            smtp.login(user, password)
        smtp.send_message(msg)
