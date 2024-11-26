class Company:
    def __init__(self, symbol, short_name, state, industry, sector):
        self.symbol = symbol
        self.short_name = short_name
        self.state = state
        self.industry = industry
        self.sector = sector

class Owner:
    def __init__(self, name, owner_class):
        self.name = name
        self.owner_class = owner_class
        self.holdings = {}
        self.total_value = 0
    
    def add_holding(self, symbol, value):
        self.holdings[symbol] = value
        self.total_value += value