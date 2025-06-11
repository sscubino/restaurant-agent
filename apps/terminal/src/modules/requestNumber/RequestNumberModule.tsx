import * as React from 'react'
import { IRequestNumber } from '../../services/api/admin/types'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api/admin/admin'

const initialState: IRequestNumber = {
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    message: ""
}

type keys = 'name' | 'lastName' | 'phoneNumber' | 'email' | 'message'

const RequestNumberModule = () => {
    const [formData, setFormData] = React.useState<IRequestNumber>(initialState)
    const [errors, setErrors] = React.useState<Partial<IRequestNumber>>({})
    const navigate = useNavigate()

    const validateField = (key: keys, value: string) => {
        if (key !== "message" && !value.trim()) {
            setErrors((prev) => ({ ...prev, [key]: "This field is required" }))
        } else {
            setErrors((prev) => {
                const { [key]: _, ...rest } = prev
                return rest
            })
        }
    }

    const handleFormData = (key: keys, value: string) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: value
        }))
        validateField(key, value)
    }

    const handleSendEmail = async(e: any) => {
        e.preventDefault()
        
        const newErrors: Partial<IRequestNumber> = {}
        Object.keys(formData).forEach((key) => {
            if (key !== "message" && (!formData[key as keys] || !formData[key as keys]!.trim())) {
                newErrors[key as keys] = "This field is required"
            }
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Please fill in all required fields")
            return
        }

        try {
            const resp = await api.user.sendEmail(formData)

            if(resp.ok) {
                toast.success("Request sent successfully")
                setFormData(initialState) 
                navigate('/login')
            }

        } catch (error: any) {
            toast.error('Error: ', error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-500">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-black">Contact Request</h2>
                    <p className="text-gray-600 text-sm">Please complete the form below. It is important to request a number for a successful registration.</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSendEmail}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                onChange={(e) => handleFormData('name', e.target.value)}
                                value={formData.name}
                                id="firstName"
                                type="text"
                                placeholder="John"
                                required
                                className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                onChange={(e) => handleFormData('lastName', e.target.value)}
                                value={formData.lastName}
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                required
                                className={`w-full p-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            onChange={(e) => handleFormData('phoneNumber', e.target.value)}
                            value={formData.phoneNumber}
                            id="phone"
                            type="tel"
                            placeholder="+34 123 456 789"
                            required
                            className={`w-full p-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            onChange={(e) => handleFormData('email', e.target.value)}
                            value={formData.email}
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            required
                            className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (optional)</label>
                        <textarea
                            onChange={(e) => handleFormData('message', e.target.value)}
                            value={formData.message}
                            id="message"
                            placeholder="Write your message here..."
                            className="w-full p-2 border border-gray-300 rounded-md h-24"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={Object.keys(errors).length > 0}
                        className={`w-full text-white p-2 rounded-md ${Object.keys(errors).length > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black'}`}
                    >
                        Send Request
                    </button>
                </form>
            </div>
        </div>
    )
}

export default RequestNumberModule
