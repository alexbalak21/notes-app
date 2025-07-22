import React, {useState} from "react"
import {Container, TextField, Button, Typography, Box} from "@mui/material"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (event) => {
    event.preventDefault()
    if (username === "admin" && password === "password") {
      setError("")
      alert("Login successful!")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
          <TextField label="Username" variant="outlined" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button variant="contained" color="primary" type="submit" sx={{mt: 2}}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default Login
