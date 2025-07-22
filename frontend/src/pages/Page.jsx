import {Container, Typography} from "@mui/material"
import React from "react"
import TabPanel from "../components/TabPanel"

export default function Page() {
  return (
    <Container>
      <Typography sx={{mb: 4}} variant="h4">
        Page
      </Typography>
      <TabPanel />
    </Container>
  )
}
