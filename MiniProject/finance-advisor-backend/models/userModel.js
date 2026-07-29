const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        },
        // Profile fields related to the Wealth Plan
        profile: {
            monthlyIncome: { type: Number, default: 0 },
            monthlyExpenses: { type: Number, default: 0 },
            goal: { type: String, default: 'emergency' },
            riskAppetite: { type: String, default: 'med' },
            investmentHorizon: { type: Number, default: 5 },
            customAssets: [{
                assetType: String,
                code: String,
                allocation: Number
            }]
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
