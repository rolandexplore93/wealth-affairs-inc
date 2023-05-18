const { default: mongoose } = require("mongoose");
const investment = require("../models/investment");

exports.decideInvestment = async (req, res) => {
    const { _id, name } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ message: 'Investment ID is invalid' });
    try {
        const getInvestmentData = await investment.findById(_id);
        if (!getInvestmentData) return res.status(400).json({ message: 'Investment ID does not exists in the database' });
        if (getInvestmentData.status === 'REJECTED' || getInvestmentData.status === 'APPROVED') return res.status(404).json({ message: 'Investment has already been decided by the RM.' });

        // Since getInvestmentData is an instance Mongoose dcoument when using findByIdAndUpdate,
        // toObject() will convert it to plain JavaScript object before spreading it into the update object
        if (name === 'reject'){
            await investment.findByIdAndUpdate(_id, { ...getInvestmentData.toObject() , status: "REJECTED" }, { new: true });
            return res.status(200).json({ message: 'Investment rejected.' });
        } else if (name === 'approve'){
            await investment.findByIdAndUpdate(_id, { ...getInvestmentData.toObject(), status: 'APPROVED' }, { new: true });
            return res.status(200).json({ message: 'Investment approved.' });
        }
        return res.status(404).json({ message: 'Please, select approve or reject investment' });
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}