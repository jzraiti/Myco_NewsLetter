from __future__ import annotations

import hashlib
import os
import subprocess
import sys
import venv
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "backend"
VENV_DIR = BACKEND_DIR / ".venv"
REQUIREMENTS_FILE = BACKEND_DIR / "requirements-dev.txt"
FINGERPRINT_FILE = VENV_DIR / ".requirements-dev.sha256"
PYTEST_ARGS = ["-m", "pytest", "-c", "backend/pytest.ini", "backend/tests"]


def venv_python() -> Path:
    if os.name == "nt":
        return VENV_DIR / "Scripts" / "python.exe"
    return VENV_DIR / "bin" / "python"


def requirements_fingerprint() -> str:
    return hashlib.sha256(REQUIREMENTS_FILE.read_bytes()).hexdigest()


def ensure_virtualenv() -> None:
    python_path = venv_python()
    if python_path.exists():
        return

    VENV_DIR.parent.mkdir(parents=True, exist_ok=True)
    venv.EnvBuilder(with_pip=True).create(VENV_DIR)


def install_dependencies_if_needed() -> None:
    fingerprint = requirements_fingerprint()
    python_path = venv_python()
    current = FINGERPRINT_FILE.read_text().strip() if FINGERPRINT_FILE.exists() else None

    if current == fingerprint:
        return

    if not VENV_DIR.exists():
        ensure_virtualenv()

    subprocess.run(
        [str(python_path), "-m", "pip", "install", "-r", str(REQUIREMENTS_FILE)],
        cwd=REPO_ROOT,
        check=True,
    )
    VENV_DIR.mkdir(parents=True, exist_ok=True)
    FINGERPRINT_FILE.write_text(fingerprint + "\n")


def main() -> int:
    ensure_virtualenv()
    install_dependencies_if_needed()
    python_path = venv_python()

    completed = subprocess.run([str(python_path), *PYTEST_ARGS], cwd=REPO_ROOT)
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
