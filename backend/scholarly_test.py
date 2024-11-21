from scholarly import ProxyGenerator, scholarly

# pg = ProxyGenerator()
# pg.FreeProxies()
# scholarly.use_proxy(pg)


def fetch_scholar_results(keywords):
    query = ','.join(keywords)
    search_query = scholarly.search_pubs(query=query,sort_by="date",)
    
    results = []
    index = 0

    while index < 10:
        print(f"Fetching result {index}")
        try:
            result = next(search_query)
            results.append(result)
            index += 1
        except StopIteration:
            break
        except Exception as e:
            print(e)
            break
    
    return results

keywords = ["mycology", "fungi", "mushrooms"]
results = fetch_scholar_results("mycology")

for result in results:
    print(result['bib']['title'])