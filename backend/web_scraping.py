from bs4 import BeautifulSoup
import requests
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import pprint


def fetch_html():
    headers = {
        "sec-ch-ua-platform": '"Linux"',
        "Referer": "https://scholar.google.com/scholar?as_vis=0&q=mycology,fungi,mushrooms&hl=en&as_sdt=7,50&as_ylo=2024",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Chromium";v="130", "Brave";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
    }

    options = webdriver.ChromeOptions()

    # Set Headers
    for key, value in headers.items():
        options.add_argument(f"--{key}={value}")
    # options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)

    keywords = ["mycology", "fungi", "mushrooms"]
    since_year = 2024
    url = f"https://www.semanticscholar.org/search?year%5B0%5D=2024&year%5B1%5D=2024&q=mycology&sort=relevance"
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.get(url=url)
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CLASS_NAME, "result-page"))
    )

    pprint.pprint(driver.page_source)


fetch_html()
