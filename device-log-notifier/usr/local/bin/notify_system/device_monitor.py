#!/usr/bin/env python3
"""Device log + resource monitor

変更点
- psutil で CPU 時間・RSS・経過秒を取得する機能を追加
- `pid_file_path`, `collect_resource` を __init__ で受け取る
- 取得したリソース統計を `[RES] ...` 形式の疑似ログ行として matched_lines に追加
"""

from __future__ import annotations

import os
import re
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage
from typing import List, Optional

import psutil


class DeviceMonitor:
    """1 つの装置のログ + リソース監視を担当するクラス"""

    def __init__(
        self,
        device_name: str,
        log_file_path: str,
        offset_file_path: str,
        pattern_str: str,
        pid_file_path: Optional[str] = None,
        collect_resource: bool = False,
    ) -> None:
        self.device_name = device_name
        self.log_file_path = log_file_path
        self.offset_file_path = offset_file_path
        self.pattern = re.compile(pattern_str)
        self.pid_file_path = pid_file_path
        self.collect_resource = collect_resource

        self.offset = 0

    # ------------------------------------------------------------------
    # offset helpers
    # ------------------------------------------------------------------
    def read_offset(self) -> None:
        """最後に読み込んだファイル位置を offset_file から取得"""
        if not os.path.exists(self.offset_file_path):
            self.offset = 0
            print(f"[DEBUG] Offset file not found. device={self.device_name}")
            return

        with open(self.offset_file_path, "r") as f:
            offset_str = f.read().strip()
            self.offset = int(offset_str) if offset_str.isdigit() else 0
        print(f"[DEBUG] Read offset={self.offset}, device={self.device_name}")

    def save_offset(self, new_offset: int) -> None:
        """最新の読み込み位置を offset_file に保存"""
        with open(self.offset_file_path, "w") as f:
            f.write(str(new_offset))
        print(f"[DEBUG] Saved offset={new_offset}, device={self.device_name}")

    # ------------------------------------------------------------------
    # main logic
    # ------------------------------------------------------------------
    def _resource_line(self) -> str | None:
        """PID ファイルがあればリソース統計を取得して文字列にして返す"""
        if not (self.collect_resource and self.pid_file_path):
            return None
        if not os.path.exists(self.pid_file_path):
            return "[RES] pid_file_absent"

        # read pid
        try:
            with open(self.pid_file_path) as f:
                pid = int(f.read().strip())
        except (ValueError, OSError):
            return "[RES] pid_read_error"

        # query process
        try:
            proc = psutil.Process(pid)
            cpu_sec = proc.cpu_times().user + proc.cpu_times().system
            rss = proc.memory_info().rss
            started = datetime.fromtimestamp(proc.create_time(), tz=timezone.utc)
            elapsed = (datetime.now(tz=timezone.utc) - started).total_seconds()
            return (
                f"[RES] pid={pid} cpu_sec={cpu_sec:.2f} "
                f"rss={rss} elapsed_sec={int(elapsed)}"
            )
        except psutil.NoSuchProcess:
            return "[RES] process_finished"
        except psutil.Error as exc:
            return f"[RES] psutil_error={exc}"

    def monitor_log(self) -> List[str]:
        """ログファイルを監視しパターンにマッチする行とリソース統計を返す"""
        if not os.path.exists(self.log_file_path):
            print(f"[DEBUG] Log file not found. path={self.log_file_path}")
            return []

        matched: List[str] = []
        new_offset = self.offset

        with open(self.log_file_path, "r", encoding="utf-8", errors="replace") as log_file:
            log_file.seek(self.offset)
            for line in log_file:
                encoded = line.encode("utf-8", errors="replace")
                new_offset += len(encoded)
                if self.pattern.search(line):
                    matched.append(line.strip())

        # append resource statistics if requested
        res_line = self._resource_line()
        if res_line:
            matched.append(res_line)

        # update offset after reading
        self.save_offset(new_offset)
        return matched


class MailNotifier:
    """SMTP 経由で通知メールを送信するユーティリティ"""

    def __init__(
        self,
        mail_host: str,
        mail_port: int,
        from_addr: str,
        to_addrs: List[str],
    ) -> None:
        self.mail_host = mail_host
        self.mail_port = mail_port
        self.from_addr = from_addr
        self.to_addrs = to_addrs

    def send_mail(self, subject: str, body: str) -> None:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = self.from_addr
        msg["To"] = ", ".join(self.to_addrs)
        msg.set_content(body)

        print(f"[DEBUG] Sending mail subject={subject}, to={self.to_addrs}")
        with smtplib.SMTP(self.mail_host, self.mail_port) as smtp:
            smtp.send_message(msg)
        print("[DEBUG] Mail sent.")
