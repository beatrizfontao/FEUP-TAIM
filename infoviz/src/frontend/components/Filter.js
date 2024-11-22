import { Dropdown, Form, Button, Accordion, InputGroup } from 'react-bootstrap';

function Filter({ sectorsList, statesList, selectedHierarchy, onHierarchyChange, selectedStates, onStateChange, selectedSectors, onSectorChange, selectedHolder, onHolderChange, selectedNumber, onTopHoldersChange }) {

  const handleSelectAllStates = () => onStateChange(statesList);
  const handleDeselectAllStates = () => onStateChange([]);

  const handleSelectAllSectors = () => onSectorChange(sectorsList);
  const handleDeselectAllSectors = () => onSectorChange([]);

  const hierarchyOptions = [
    { label: 'Owner - Company', value: 'owner_company' },
    { label: 'Owner - Sector - Company', value: 'owner_sector_company' },
    { label: 'Owner - Sector - Industry', value: 'owner_industry' },
    { label: 'Sector - Industry - Owner', value: 'sector' }
  ];

  const holderOptions = [
    { label: 'Top Institutional Holder', value: 'institutional' },
    { label: 'Top Mutual Funds Holder', value: 'mutual' },
    { label: 'Both', value: 'both' }
  ];

  return (
    <div>
      <div className="d-flex align-items-center mb-3" >
        <Dropdown onSelect={(selectedValue) => onHierarchyChange(selectedValue)} >
          <Dropdown.Toggle
            variant="success"
            id="dropdown-basic"
            style={{ width: '23em' }}
            className="text-start"
          >
            {hierarchyOptions.find(option => option.value === selectedHierarchy)?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {hierarchyOptions.map(option => (
              <Dropdown.Item key={option.value} eventKey={option.value}>
                {option.label}
              </Dropdown.Item>))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="d-flex align-items-center mb-3">

        <Dropdown onSelect={(selectedValue) => onHolderChange(selectedValue)}>
          <Dropdown.Toggle
            variant="success"
            id="dropdown-basic"
            style={{ width: '23em' }}
            className="text-start"
          >
            {holderOptions.find(option => option.value === selectedHolder)?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {holderOptions.map(option => (
              <Dropdown.Item key={option.value} eventKey={option.value}>
                {option.label}
              </Dropdown.Item>))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <InputGroup className="mt-3">
        <InputGroup.Text>Top Holders</InputGroup.Text>
        <Form.Control
          type="number"
          min="1"
          max="500"
          defaultValue={selectedNumber}
          onChange={(e) => onTopHoldersChange(e.target.value)} // Pass the event value to the handler
        />
      </InputGroup>



      {/* Accordion for State Selection */}
      <Accordion defaultActiveKey="0" className="mt-3">
        <Accordion.Item eventKey="1">
          <Accordion.Header>Filter by States</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex align-items-center mb-3">
              <Button variant="secondary" onClick={handleSelectAllStates}>
                Select All
              </Button>
              <Button variant="secondary" onClick={handleDeselectAllStates} className="ms-2">
                Deselect All
              </Button>
            </div>

            <div className="mt-3">
              {statesList.map((state) => (
                <Form.Check
                  type="checkbox"
                  label={state}
                  key={state}
                  checked={selectedStates.includes(state)}
                  onChange={() => {
                    const newStates = selectedStates.includes(state)
                      ? selectedStates.filter(s => s !== state)
                      : [...selectedStates, state];
                    onStateChange(newStates);
                  }}
                />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Filter by Sector</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex align-items-center mb-3">
              <Button variant="secondary" onClick={handleSelectAllSectors}>
                Select All
              </Button>
              <Button variant="secondary" onClick={handleDeselectAllSectors} className="ms-2">
                Deselect All
              </Button>
            </div>

            <div className="mt-3">
              {sectorsList.map((sector) => (
                <Form.Check
                  type="checkbox"
                  label={sector}
                  key={sector}
                  checked={selectedSectors.includes(sector)}
                  onChange={() => {
                    const newSectors = selectedSectors.includes(sector)
                      ? selectedSectors.filter(s => s !== sector)
                      : [...selectedSectors, sector];
                    onSectorChange(newSectors);
                  }}
                />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </div >
  );
}

export default Filter;
