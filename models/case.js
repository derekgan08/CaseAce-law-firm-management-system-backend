const mongoose = require('mongoose');
const { Schema } = mongoose

const validateArrayLength = (value) => {
    if (!Array.isArray(value) || value.length == 0) {
        return false;
    }
    return true
}
// Schema
const caseSchema = new Schema({
    case_title: {
        type: String,
        required: [true, "Case_title should not be null"],
    },
    case_created_by: {
        type: String,
        required: [true, "Case_created_by should not be null"],
    },
    case_description: {
        type: String,
        required: [true, "Case_description should not be null"],
    },
    case_type: {
        type: String,
        required: [true, "Case_type should not be null"],
    },
    case_status: {
        type: String,
        required: [true, "Case_status should not be null"],
    },
    case_priority: {
        type: String,
        required: [true, "Case_priority should not be null"],
    },
    case_total_billed_hour: {
        type: Number,
        required: [true, "Case_total_billed_hour should not be null"],
    },
    case_member_list: {
        type: [
            {
                case_member_id: {
                    type: String,
                    required: true,
                },
                case_member_type: {
                    type: String,
                    required: true,
                },
                case_member_role: {
                    type: String,
                    required: true,
                },
            }],
        validate: {
            validator: validateArrayLength,
            message: "Case_member_list should not be empty array"
        }
    }
})

// Model
const CaseModel = mongoose.model('Case', caseSchema);

module.exports = CaseModel