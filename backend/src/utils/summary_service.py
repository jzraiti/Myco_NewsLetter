import os

from openai import OpenAI


SYSTEM_PROMPT = (
    "You are an expert in mycology and fungi, skilled at crafting professional, "
    "concise, and clear summaries for mycology research articles. Your task is to "
    "create newsletter-style previews that present key findings from global researchers "
    "in a straightforward, academic manner, focusing on surprising or significant results."
)


def generate_gpt_paper_summary(
    title: str,
    content: str,
    client=None,
) -> str:
    """Generates a summary of a research paper using GPT-4o."""
    active_client = client or OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    completion = active_client.chat.completions.create(
        model="gpt-4o",
        temperature=1,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Write a concise, informational sneak peek for a research paper titled '{title}' "
                    f"based on this abstract: {content}. Begin with a sentence defining key terms for "
                    "context. Tailor it for a mycology research audience. Use formal, human-like "
                    "language without excessive embellishment. Keep it under 400 characters."
                ),
            },
        ],
    )
    return completion.choices[0].message.content
