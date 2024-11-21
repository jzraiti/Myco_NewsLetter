import requests


def get_aws_token() -> str:
    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "text/plain;charset=UTF-8",
        "origin": "https://www.semanticscholar.org",
        "priority": "u=1, i",
        "referer": "https://www.semanticscholar.org/",
        "sec-ch-ua": '"Chromium";v="130", "Brave";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "sec-gpc": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    }

    data = '{"existing_token":"862c7f79-cbf7-4838-b7aa-236818efdb50:EgoAdGocPBNUAQAA:kC8q52+oKL9gAimvkCGxPIsEquPMcfyiwDpTElS9bguOGd7HYHwoOij6coZfDGMgk5jrgmczztx6eBBOStDV++eY0xr2gqUEBc000pdWVTlHO+3yt89uP+In+EUm/LzZOZKW/E145UUmtQ9o6UIPpc+BwNKJNSLvOH5WnW9ExLvCrbRmiHABdarRnBcOq9Rj/Sffrah5XaP87ysrGOzgbcepa1e7nwn8hlhSjJ3VJpt5Eooe2Nfvo1CPRRnwKT2qVymfy5PqfxSIVAxWIAI=","awswaf_session_storage":"null","client":"Browser","signals":[{"name":"KramerAndRio","value":{"Present":"ysJcGxzjs6UKim1F::12a0888db427d1f1d3513a36e9feba95::4bec636154466b5b575fe7b897e9c1db7d6070f2ce1e2accf66ef589c3153f7d6b4fadf3873523fd87b089abbdf16db67c65dcad81fa4c60bd3a15f999052907c0f4b853edac9a09c31cc6ee1cc6cd6b620819dc6489d09c84b30234071eb76ea2ddfb4f76c12ee4795ce959883fc98a6bc62257d87ff5e1199e3089be3cdeba3d71b17bf87d55cbf2ff187604226f28695d496524a9a0da12b903febc058f4b70de9cd03d3ebfadc113972a5315492ced29144d7f97943b61acd92542c501fe4418e1a40a308662ee65edfc931e6cb191987d316c7a1d1636e3b175284a6d7ef5685f532d37585d7f8dd88dfcc26c438bc6c8e2c8"}}],"checksum":"53CCC1C0","metrics":[{"name":"12","value":0.19999998807907104,"unit":"2"},{"name":"200","value":1,"unit":"2"},{"name":"201","value":0,"unit":"2"},{"name":"13","value":1.5,"unit":"2"},{"name":"10","value":0,"unit":"4"},{"name":"9","value":2,"unit":"4"},{"name":"11","value":5.899999976158142,"unit":"2"}]}'

    response = requests.post(
        "https://c09bc9c04079.85f87d4a.us-east-2.token.awswaf.com/c09bc9c04079/4996efde3854/telemetry",
        headers=headers,
        data=data,
    )

    return response.json().get("token")
