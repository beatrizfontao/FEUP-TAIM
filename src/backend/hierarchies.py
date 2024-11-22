from utils import *
import json

#creates json with hierarchy sector, industry and owner
def sector_industry_owner(sectors, companies, holders):
    
    hierarchy = {"name": "flare", "children": []}
    
    for sector in sectors:
        sector_node = {"name": sector, "children": []}
        industries = get_industries_of_sector(sector, companies) #returns a list
        
        for industry in industries:
            industry_node = {"name": industry, "children": []}
            owners = get_holders_of_industry(industry, holders, companies) #return a dict with owner name:value
            
            for owner_name, value in owners.items():
                owner_node = {
                    "name": owner_name,
                    "value": value
                }
                industry_node["children"].append(owner_node)
                
            sector_node["children"].append(industry_node)
            
        hierarchy["children"].append(sector_node)

    return json.dumps(hierarchy, indent=4)

#creates json with hierarchy owner, industry, sector
def owner_sector_industry(companies, holders):
    
    hierarchy = {"name": "flare", "children": []}
    
    for holder in holders:
        holder_node = {"name": holder.name, "children": []}
        sectors_industries = get_sectors_of_holder(holder, companies)
        
        for sector in list(sectors_industries.keys()):
            sector_node = {"name": sector, "children": []}
        
            for industry in list(sectors_industries[sector].keys()):
                industry_node = {
                    "name": industry,
                    "value": sectors_industries[sector][industry]
                }
                sector_node["children"].append(industry_node)
                
            holder_node["children"].append(sector_node)
            
        hierarchy["children"].append(holder_node)

    return json.dumps(hierarchy, indent=4)

def owner_sector_company(companies, holders):
    hierarchy = {"name": "flare", "children": []}
    
    for holder in holders:
        holder_node = {"name": holder.name, "children": []}
        sectors_companies = get_companies_of_holder(holder, companies)
        
        for sector in list(sectors_companies.keys()):
            sector_node = {"name": sector, "children": []}
        
            for company in list(sectors_companies[sector].keys()):
                company_node = {
                    "name": company,
                    "value": sectors_companies[sector][company]
                }
                sector_node["children"].append(company_node)
                
            holder_node["children"].append(sector_node)
            
        hierarchy["children"].append(holder_node)

    return json.dumps(hierarchy, indent=4)

def owner_company(holders):
    hierarchy = {"name": "flare", "children": []}
    
    for holder in holders:
        holder_node = {"name": holder.name, "children": []}

        for company, value in holder.holdings.items():
            company_node = {
                "name": company,
                "value": value
            }
            holder_node["children"].append(company_node)
            
        hierarchy["children"].append(holder_node)

    return json.dumps(hierarchy, indent=4)

#this one takes into account the companies' sector
def owner_company1(companies, holders):
    hierarchy = {"name": "flare", "children": []}
    
    for holder in holders:
        holder_node = {"name": holder.name, "children": []}
        sectors_companies = get_companies_of_holder(holder, companies)
        
        for sector in list(sectors_companies.keys()):
        
            for company in list(sectors_companies[sector].keys()):
                company_node = {
                    "name": company,
                    "value": sectors_companies[sector][company]
                }
                holder_node["children"].append(company_node)
            
        hierarchy["children"].append(holder_node)

    return json.dumps(hierarchy, indent=4)