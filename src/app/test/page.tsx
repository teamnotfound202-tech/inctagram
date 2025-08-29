'use client'
import {useState} from "react";
import {SimpleDatePicker} from "@/shared/ui/DatePicker/SimpleDatePicker/SimpleDatePicker";

export default function Home() {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md">
                <h1 className="text-lg font-semibold text-gray-900 mb-4">
                    Date Range Picker
                </h1>

                <SimpleDatePicker

                />

                {(startDate && endDate) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            Selected range: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}