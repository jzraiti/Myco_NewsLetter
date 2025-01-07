from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import os
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


def create_instance(sheet_type: str):
    """
    Authenticate using a service account and create a Sheets API instance.
    """
    SPREADSHEET_ID = os.getenv(f"MYCO_SPREADSHEET_ID")
    SERVICE_ACCOUNT_FILE = os.getenv("SERVICE_ACCOUNT_FILE")

    try:
        # Authenticate using the service account JSON key
        creds = Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        service = build("sheets", "v4", credentials=creds)
        return service, SPREADSHEET_ID
    except Exception as e:
        logging.info(
            f"An error occurred while building the Sheets service: {e}", exc_info=True
        )
        return None, None