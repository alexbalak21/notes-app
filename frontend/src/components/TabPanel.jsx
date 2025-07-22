import * as React from "react"
import PropTypes from "prop-types"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import {MenuItem, Select, FormControl, InputLabel} from "@mui/material" // Added necessary imports

// TabPanel component to render the content of each tab
function TabPanel(props) {
  const {children, value, index, ...other} = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

// Accessibility props for the tabs
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0) // State to control the current active tab

  const handleChange = (event, newValue) => {
    setValue(newValue) // Function to handle tab change
  }

  const handleSelectChange = (event) => {
    setValue(event.target.value) // Function to handle select menu change
  }

  return (
    <Box sx={{width: "100%"}}>
      {/* Select menu to quickly jump to a specific tab */}
      <FormControl fullWidth sx={{mb: 2}}>
        <InputLabel id="tab-select-label">Select Tab</InputLabel>
        <Select labelId="tab-select-label" id="tab-select" value={value} label="Select Tab" onChange={handleSelectChange}>
          {Array.from({length: 20}, (_, index) => (
            <MenuItem key={index} value={index}>
              {`Item ${index + 1}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{borderBottom: 1, borderColor: "divider"}}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto" // Make the tabs horizontally scrollable
        >
          {Array.from({length: 20}, (_, index) => (
            <Tab key={index} label={`Item ${index + 1}`} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {Array.from({length: 20}, (_, index) => (
        <TabPanel key={index} value={value} index={index}>
          {`Item ${index + 1}`}
        </TabPanel>
      ))}
    </Box>
  )
}
