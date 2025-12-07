import { useState } from 'react';

export const ControlPanel = () => {
    const [length, setLength] = useState('');
    const [drawnBy, setDrawnBy] = useState('');
    const [checkedBy, setCheckedBy] = useState('');
    const [approved, setApproved] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [pdfReady, setPdfReady] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    // API URL - use ngrok for remote access, localhost for local development
    const API_URL = 'https://zoologically-postprostate-reggie.ngrok-free.dev';
    // const API_URL = 'http://localhost:5075'; // Uncomment for local development

    const handleUpdate = async () => {
        setLoading(true);
        setStatus('');
        setPdfReady(false);
        setPdfUrl('');
        try {
            const response = await fetch(`${API_URL}/SolidWorks/update`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    length: parseFloat(length),
                    drawnBy,
                    checkedBy,
                    approved,
                    date: new Date(date).toISOString()
                })
            });
            const data = await response.json();
            if (response.ok) {
                setStatus('success:' + data.message);
                // Update preview image if available
                if (data.previewUrl) {
                    setPreviewUrl(API_URL + data.previewUrl);
                }
                // Check if PDF is ready for download
                if (data.pdfReady && data.pdfUrl) {
                    setPdfReady(true);
                    setPdfUrl(API_URL + data.pdfUrl);
                }
            } else {
                setStatus('error:' + data.message);
            }
        } catch (error) {
            setStatus('error:Could not connect to server. Make sure the API is running.');
            console.error(error);
        }
        setLoading(false);
    };

    const handleDownloadPdf = () => {
        if (pdfUrl) {
            // Create a temporary link with ngrok header
            const link = document.createElement('a');
            link.href = pdfUrl + '&ngrok-skip-browser-warning=true';
            link.download = 'Flap-Drawing.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const isSuccess = status.startsWith('success:');
    const statusMessage = status.replace(/^(success:|error:)/, '');

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Main Container - Split Design */}
            <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-0 overflow-hidden rounded-2xl shadow-2xl shadow-cyan-500/10">
                
                {/* Left Panel - Hero Section */}
                <div className="lg:w-2/5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                    {/* Animated Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
                            Flap
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                Controller
                            </span>
                        </h1>
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Update flap dimensions directly from the web.
                        </p>

                        {/* Flap Diagram / Live Preview */}
                        <div className="bg-white rounded-xl p-3 shadow-lg">
                            {previewUrl ? (
                                <div>
                                    <div className="text-xs text-gray-500 mb-2 text-center font-medium">LIVE PREVIEW</div>
                                    <img 
                                        src={previewUrl} 
                                        alt="Updated Flap Preview" 
                                        className="w-full h-auto"
                                    />
                                </div>
                            ) : (
                                <img 
                                    src="/flap-diagram.png" 
                                    alt="Flap Diagram" 
                                    className="w-full h-auto"
                                />
                            )}
                        </div>
                    </div>

                    {/* Stats/Info */}
                    <div className="relative z-10 mt-6 pt-6 border-t border-gray-700/50">
                        <div className="flex gap-8">
                            <div>
                                <div className="text-xl font-bold text-cyan-400">API</div>
                                <div className="text-xs text-gray-500">Connected</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-blue-400">v1.0</div>
                                <div className="text-xs text-gray-500">Version</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="lg:w-3/5 bg-gray-950 p-8 lg:p-12">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-2">Update Parameters</h2>
                        <p className="text-gray-500 mb-8">Enter the flap specifications below</p>

                        {/* Form Grid */}
                        <div className="space-y-6">
                            {/* Length Input - Featured */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                                    Flap Length
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-800 rounded-xl text-white text-lg font-medium placeholder-gray-600 focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                                        placeholder="0.00"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">inches</span>
                                </div>
                            </div>

                            {/* Two Column Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-0 transition-colors outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Drawn By
                                    </label>
                                    <input
                                        type="text"
                                        value={drawnBy}
                                        onChange={(e) => setDrawnBy(e.target.value.slice(0, 3).toUpperCase())}
                                        maxLength={3}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-0 transition-colors outline-none uppercase"
                                        placeholder="ABC"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Checked By
                                    </label>
                                    <input
                                        type="text"
                                        value={checkedBy}
                                        onChange={(e) => setCheckedBy(e.target.value.slice(0, 3).toUpperCase())}
                                        maxLength={3}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-0 transition-colors outline-none uppercase"
                                        placeholder="ABC"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Approved By
                                    </label>
                                    <input
                                        type="text"
                                        value={approved}
                                        onChange={(e) => setApproved(e.target.value.slice(0, 3).toUpperCase())}
                                        maxLength={3}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-0 transition-colors outline-none uppercase"
                                        placeholder="ABC"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleUpdate}
                                disabled={loading || !length}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                                    loading || !length
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Update Model
                                    </>
                                )}
                            </button>

                            {/* Status Message */}
                            {status && (
                                <div className={`p-4 rounded-xl flex items-start gap-3 ${
                                    isSuccess ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'
                                }`}>
                                    {isSuccess ? (
                                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                    <span className={`text-sm ${isSuccess ? 'text-emerald-300' : 'text-red-300'}`}>
                                        {statusMessage}
                                    </span>
                                </div>
                            )}

                            {/* PDF Download Button */}
                            {pdfReady && (
                                <button
                                    onClick={handleDownloadPdf}
                                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Drawing PDF
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
