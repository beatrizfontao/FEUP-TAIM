import React, { useState, useEffect } from 'react';
import SunburstChart from './components/SunburstChart';
import Header from './common/Header';
import Filter from './components/Filter';
import axios from 'axios';
import {Offcanvas } from 'react-bootstrap';

const stateAbbreviations = {
  'Outside of the US' : 'OUT',
  'Alabama': 'AL',
  // 'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  // 'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  // 'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  // 'Mississippi': 'MS',
  'Missouri': 'MO',
  // 'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  // 'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  // 'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  // 'South Carolina': 'SC',
  // 'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  // 'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  // 'West Virginia': 'WV',
  'Wisconsin': 'WI',
  // 'Wyoming': 'WY',
};

const statesList = Object.keys(stateAbbreviations);

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [data, setData] = useState(null);
  const [sectorsList, setSectorsList] = useState(null);

  const [selectedHierarchy, setSelectedHierarchy] = useState('owner_sector_company');
  const [selectedStates, setSelectedStates] = useState(statesList);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedHolder, setSelectedHolder] = useState('institutional');
  const [selectedNumber, setSelectedNumber] = useState(10)

  const toggleOptions = () => setShowOptions(!showOptions);

  const fetchHierarchy = (sectors, states, hierarchy, holder, top) => {
    const abbreviatedStates = states.map(state => stateAbbreviations[state]);
    console.log("Selected Hierarchy:", hierarchy);
    console.log("Selected States:", abbreviatedStates);
    console.log("Selected Sectors:", sectors);
    console.log("Selected Holder:", holder);
    const params = new URLSearchParams();
    sectors.forEach(sector => params.append('sectors', sector));
    abbreviatedStates.forEach(state => params.append('states', state));
    params.append('hierarchy', hierarchy);
    params.append('owner_class', holder);
    params.append('number_holders', top);
    axios.get(`http://127.0.0.1:5000/api/sectors?${params.toString()}`)
      .then(response => setData(response.data))
      .catch(error => console.error("There was an error fetching the stock data!", error));
  }

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/sectorList`).then(response => {
      const sectors = response.data;
      setSectorsList(sectors);
      setSelectedSectors(sectors);
      fetchHierarchy(sectors, statesList, selectedHierarchy, selectedHolder, selectedNumber);
    })
      .catch(error => console.error("There was an error fetching the stock data!", error));

  }, []);


  const updateSelections = (newHierarchy, newStates, newSectors, newHolder, newNumber) => {
    setSelectedHierarchy(newHierarchy);
    setSelectedStates(newStates);
    setSelectedSectors(newSectors);
    setSelectedHolder(newHolder)
    setSelectedNumber(newNumber)
    fetchHierarchy(newSectors, newStates, newHierarchy, newHolder, newNumber)
  };

  return (
    <div className="App">
      
      <Header onToggleOptions={toggleOptions} />
      {data ? <SunburstChart data={data} /> : <p>Loading...</p>}
      {/* <SunburstChart></SunburstChart > */}
      {/* Options Panel */}
      <Offcanvas show={showOptions} onHide={toggleOptions} placement="end" >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Filter
            sectorsList={sectorsList}
            statesList={statesList}
            selectedHierarchy={selectedHierarchy}
            onHierarchyChange={(newHierarchy) => updateSelections(newHierarchy, selectedStates, selectedSectors, selectedHolder, selectedNumber)}
            selectedStates={selectedStates}
            onStateChange={(newStates) => updateSelections(selectedHierarchy, newStates, selectedSectors, selectedHolder, selectedNumber)}
            selectedSectors={selectedSectors}
            onSectorChange={(newSectors) => updateSelections(selectedHierarchy, selectedStates, newSectors, selectedHolder, selectedNumber)}
            selectedHolder={selectedHolder}
            onHolderChange={(newHolders) => updateSelections(selectedHierarchy, selectedStates, selectedSectors, newHolders, selectedNumber)}
            selectedNumber={selectedNumber}
            onTopHoldersChange={(newNumber) => updateSelections(selectedHierarchy, selectedStates, selectedSectors, selectedHolder, newNumber)}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default App;