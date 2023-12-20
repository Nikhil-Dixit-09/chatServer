const jwt=require('jsonwebtoken');
const auth=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        let decodedData;
        decodedData=jwt.verify(token,'chat');
        // console.log(decodedData);
        req.userId=decodedData?.id;
        req.email=decodedData?.email;
        next(); 
    }catch(err){
        console.log(err.message);
        return res.status(200).json({message:"session expired"});
    }
}

module.exports=auth;