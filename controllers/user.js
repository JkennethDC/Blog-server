const bcrypt = require("bcrypt");
const User = require("../models/User");

const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
    try {
        const existingUserByEmail = await User.findOne({ email: req.body.email });
        if (existingUserByEmail) {
            return res.status(409).send({ message: 'User email already registered' });
        }

        const existingUserByUsername = await User.findOne({ username: req.body.username });
        if (existingUserByUsername) {
            return res.status(409).send({ message: 'Username already taken' });
        }

        if (!req.body.email.includes("@")) {
            return res.status(400).send({ error: "Email invalid" });
        }

        if (req.body.password.length < 8) {
            return res.status(400).send({ error: "Password must be at least 8 characters" });
        }

        let newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        await newUser.save();
        return res.status(201).send({ message: "Registered Successfully" });

    } catch (err) {
        console.error("Error in saving user: ", err);
        return res.status(500).send({ error: "Error in registration process" });
    }
};


module.exports.loginUser = (req,res) => {
    
    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            
            
            if(result == null){
                return res.status(404).send({ error: "No Email Found" });
            } else {
                
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    
                    return res.status(200).send({ access : auth.createAccessToken(result)})
                    
                } else {
                    
                    return res.status(401).send({ message: "Email and password do not match" });
                    
                }
                
            }
            
        })
        .catch(err => err);
    } else {
        return res.status(400).send(false)
    }
};

module.exports.getProfile = (req, res) => {

	return User.findById(req.user.id)
	.then(user => {
	    if (!user) {
	        return res.status(404).send({ error: 'User not found' });
	    }

	    user.password = undefined;

	    return res.status(200).send({ user });
	})
	.catch(err => {
		console.error("Error in fetching user profile", err)
		return res.status(500).send({ error: 'Failed to fetch user profile' })
	});

}

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        if (!users) {
            return res.status(404).send({ error: 'No users found' });
        }
        return res.status(200).send({ users });
    } catch (err) {
        console.error("Error in fetching all users", err)
        return res.status(500).send({ error: 'Failed to fetch all users' })
    }
}