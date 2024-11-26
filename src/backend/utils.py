import pandas as pd
from data import *

#reads the csv file with the companies' info and creates a list of Company objects
def read_companies(file_path):
    companies = []
    df = pd.read_csv(file_path)
    for _, row in df.iterrows():
        company = Company(
            symbol=row['symbol'],
            short_name=row['shortName'],
            state=('OUT' if row['country'] != 'United States' else row['state']),
            industry=row['industry'],
            sector=row['sector']
        )
        companies.append(company)
    return companies

#reads the csv file with the holders' info and creates a list of Owner objects
def read_owners(file_path):
    owners = {}
    df = pd.read_csv(file_path)
    for _, row in df.iterrows():
        owner_name = row['name']
        owner_class = row['class']
        company_symbol = row['symbol']
        value = row['value']
        if owner_name not in owners:
            owner = Owner(owner_name, owner_class)
            owners[owner_name] = owner
        else:
            owner = owners[owner_name]
        owner.add_holding(company_symbol, value)
    return list(owners.values())

def get_industries_of_sector(sector, companies):
    industries = []
    for company in companies:
        if company.sector == sector:
            industries.append(company.industry)
    return list(set(industries))

def get_holders_of_industry(industry, owners, companies):
    owners_value = {}
    for owner in owners:
        for company in companies:
            if (company.industry == industry) and (company.symbol in list(owner.holdings.keys())):
                value = owner.holdings[company.symbol]
                owners_value[owner.name] = value
    return owners_value
                

def write_owners_to_file(owners):
    with open(r'owners.txt', 'w') as f:
        for owner in owners:
            f.write(f"Owner: {owner.name}, Class: {owner.owner_class}\n")
            f.write("Holdings:\n")
            for company_symbol, value in owner.holdings.items():
                f.write(f"  - {company_symbol}: {value}\n")
            f.write("\n")
            
def get_sectors(companies):
    sectors = []
    for company in companies:
        sectors.append(company.sector)
    return list(set(sectors))

def filter_companies(states, companies, sectors):
    states_companies = []
    for company in companies:
        if company.state in states and company.sector in sectors:
            states_companies.append(company)
    # print('Filtered companies: ')
    # for c in list(set(states_companies)):
        # print(c.symbol)
    return list(set(states_companies))

# ir ao holder, ver por company se esta nas companies, se estiver dar append ao setor e industria dessa company
def get_sectors_of_holder(holder, companies):
    sectors = {} # vai ser um dict em que os values sao dicts tipo: s2:{i2:3, i3:4}
    for holding in list(holder.holdings.keys()):
        for company in companies:
            if holding == company.symbol:
                if company.sector in list(sectors.keys()):
                    if company.industry in list(sectors[company.sector].keys()):
                        sectors[company.sector][company.industry] += holder.holdings[holding]
                    else:
                        sectors[company.sector][company.industry] = holder.holdings[holding]
                else:
                    sectors[company.sector] = {}
                    sectors[company.sector][company.industry] = holder.holdings[holding]
    # print(sectors)
    return sectors

def get_companies_of_holder(holder, companies):
    sectors = {} # vai ser um dict em que os values sao dicts tipo: s2:{c2:3, c3:4}
    for holding in list(holder.holdings.keys()):
        for company in companies:
            if holding == company.symbol:
                if company.sector in list(sectors.keys()):
                    sectors[company.sector][company.short_name] = holder.holdings[holding]
                else:
                    sectors[company.sector] = {}
                    sectors[company.sector][company.short_name] = holder.holdings[holding]
    # print(sectors)
    return sectors

def get_top_n_holders(n, holders):
    sorted_holders = sorted(holders, key=lambda holder: holder.total_value, reverse=True)
    
    return sorted_holders[:n]

def print_symbols(companies):
    for company in companies:
        print("Company symbol: ", company.symbol)

def value_per_company(companies, holders):
    company_value = {}
    for holder in holders:
        for company in companies:
            if company.symbol in list(holder.holdings.keys()):
                if company.symbol in list(company_value.keys()):
                    company_value[company.symbol] += holder.holdings[company.symbol]
                else:
                    company_value[company.symbol] = holder.holdings[company.symbol]
    return company_value

def value_per_state(companies, holders, states):
    company_value = value_per_company(companies, holders)
    state_value = {}
    
    for state in states:
        for company in companies:
            if company.state == state:
                if company.symbol in company_value:
                    if state in state_value:
                        state_value[state] += company_value[company.symbol]
                    else:
                        state_value[state] = company_value[company.symbol]
                    
    return state_value

                    