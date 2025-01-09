from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()


def generate_gpt_paper_summary(title: str, content: str) -> str:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[
            {
                "role": "system",
                "content": "You are a ChatGPT, helpful assistant that is knowledgable about Mycology and funguses and specializes in generating short sneak peeks of new mycology articles for a newsletter",
            },
            {
                "role": "user",
                "content": f"Write an informational little sneak peek for this paper titled {title} with this given abstracted summary: {content}. Limit your answer to 500 characters.",
            },
        ],
    )

    return completion.choices[0].message

if __name__ == "__main__":
    response = generate_gpt_paper_summary(
        title="Epidemiological and Mycological Profile of Otomycosis Diagnosed At the Oto-Rhino-Laryngology Department at Batna PHE – ALGERIA",
        content="""Introduction: Fungal otitis or otomycosis is a relatively common pathology. Its prevalence represents according to studies 5 to 30% of all external otitis, most often chronic or subacute and benign. It can also affect the middle ear and even in some serious cases the inner ear. The main objective was to describe the epidemiological and mycological characteristics of fungal otitis and to determine their prevalence.
Materials and Methods: This study is prospective descriptive, carried out in the parasitology department at the Batna University Hospital, in collaboration with the Otolaryngology department at the PHS Batna, during a period of four months. We included in our study patients with clinical symptoms pointing towards the diagnosis of infectious otitis. Each patient had an ear sample taken using a sterile, dry cotton swab. They are inoculated in suitable mycological media. The cultures are then incubated in an incubator at 27°C and 37°C for 48 hours up to one week. The identification of the different species of filamentous fungi is based on the macroscopic and microscopic aspects of the colonies. The identification of the yeast species was done by the auxacolor gallery. 
Results: We included 65 patients in our study, 23 of whom had proven fungal otitis (35%). We noted a predominance of the male sex (52.17%), with a sex ratio M/F = 1.09. The average age of our patients was 46.34 years, the age groups [31-45] and [46-60] were the most affected. Cleaning with cotton swabs was the most frequently found risk factor (52.27%), followed by swimming (34.43%). The most frequently found reasons for consultation were earache (48%), followed by otorrhea (31%). The location at the external auditory canal was the most frequently found (91%). We obtained 25 positive cultures; Aspergillus Niger was the most frequently isolated species (44%). 
Conclusion: The pathogenic role of fungi in the etiology of ear pathologies remains underestimated or even ignored. Currently, it is a well-defined pathology and a recurring problem whose involvement of fungi as pathogenic agents is increasing. This is favored by a certain number of predisposing factors. However, prophylactic measures are essential. Practitioners must advise patients on environmental and body hygiene.""",
    )

    print(response)