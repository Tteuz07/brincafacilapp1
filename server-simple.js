import express from 'express'
const app = express()
app.use(express.json())
app.get('/api/test', (req, res) => res.json({message: 'OK'}))
app.listen(3000, () => console.log('Server running on port 3000'))