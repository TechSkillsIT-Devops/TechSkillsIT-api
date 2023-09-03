const jwt = require('jsonwebtoken');
const secretKey = "YOUR_SECRET_KEY";

module.exports = (req,res,next)=>{ //next is a callback 
    //get token from header
    try{
        const token = req.headers['authorization'];

        // Check if token is undefined or doesn't start with 'Bearer '
        if (!token || !token.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      
        // Extract the token value (remove 'Bearer ' from the beginning)
        const authToken = token.slice(7);
         
     jwt.verify(authToken, secretKey, (err, decoded) => {
       if (err) {
      console.error('Token verification failed:', err);
       res.status(401).send('invalid token');
    } else {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
      if (decoded.exp && decoded.exp < currentTimestamp) {
        console.error('Token has expired.');
        res.status(401).send('invalid token');
        
      } else {
        next()
      }
      
    }
})
    }catch(err){
      console.error(err)
    }
}