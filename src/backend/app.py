import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils import *
from hierarchies import *

app = Flask(__name__)
CORS(app)

companies = read_companies(r'..\data\s&p500.csv')
owners = read_owners(r'..\data\sp500_top10_holders.csv')
institutional_owners = [owner for owner in owners if owner.owner_class == "Top Institutional Holders"]
mutual_fund_owners = [owner for owner in owners if owner.owner_class == "Top mutual fund Holders"]

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        with open('example.json') as f:
            data = json.load(f)
    except FileNotFoundError:
        return jsonify({"error": "Stock data file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding JSON file"}), 500

    return jsonify(data)

@app.route('/api/sectors', methods=['GET'])
def get_hierarchy():
    
    sectors = request.args.getlist('sectors')
    states = request.args.getlist('states')
    hierarchy = request.args.get('hierarchy')
    number_holders = int(request.args.get('number_holders', default=20))
    owner_class = request.args.get('owner_class', default='institutional')
    
    match owner_class:
        case "institutional":
            selected_owners = institutional_owners
        case "mutual":
            selected_owners = mutual_fund_owners
        case "both":
            selected_owners = owners
    
    filtered_companies = filter_companies(states, companies, sectors)
    top_holders = get_top_n_holders(number_holders, selected_owners)
   
    match hierarchy:
        case "sector":
            sector_hierarchy = sector_industry_owner(sectors, filtered_companies, top_holders)
            return sector_hierarchy
        case "owner_industry":
            owner_hierarchy = owner_sector_industry(filtered_companies, top_holders)
            return owner_hierarchy
        case "owner_company":
            owner_hierarchy = owner_company1(filtered_companies, top_holders)
            return owner_hierarchy
        case "owner_sector_company":
            owner_hierarchy = owner_sector_company(filtered_companies, top_holders)
            return owner_hierarchy
        case _:
            return {}
        
@app.route('/api/sectorList', methods=['GET'])
def get_sectors_list():
    return get_sectors(companies)
    
        
if __name__ == '__main__':
    app.run(debug=True)
