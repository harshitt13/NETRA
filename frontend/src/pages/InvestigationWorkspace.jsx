// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Header from '../components/common/Header';
// import Sidebar from '../components/common/Sidebar';
// import Loader from '../components/common/Loader';
// import useFetchData from '../hooks/useFetchData';
// import { Files, User, ShieldX, BrainCircuit, Users, Landmark, Home, StickyNote } from 'lucide-react';
// import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
// import 'reactflow/dist/style.css';

// // --- Sub-component for the Network Graph ---
// const NetworkGraph = ({ personId }) => {
//     const { data: graphData, loading, error } = useFetchData(`/graph/${personId}?limit=25`);
//     const [nodes, setNodes] = useState([]);
//     const [edges, setEdges] = useState([]);

//     useEffect(() => {
//         if (graphData) {
//             const formattedNodes = graphData.nodes.map(node => ({
//                 id: node.id,
//                 position: { x: Math.random() * 400, y: Math.random() * 300 },
//                 data: { label: node.label },
//                 style: {
//                     background: node.isCenter ? '#0891b2' : '#374151',
//                     color: 'white',
//                     border: node.isCenter ? '2px solid #06b6d4' : '1px solid #4b5563',
//                 },
//             }));
//             const formattedEdges = graphData.edges.map((edge, i) => ({
//                 id: `e${i}`,
//                 source: edge.source,
//                 target: edge.target,
//                 label: `₹${parseInt(edge.label).toLocaleString('en-IN')}`,
//                 animated: true,
//                 style: { stroke: '#0891b2' },
//             }));
//             setNodes(formattedNodes);
//             setEdges(formattedEdges);
//         }
//     }, [graphData]);

//     if (loading) return <div className="h-96 flex items-center justify-center"><Loader /></div>;
//     if (error) return <p className="text-red-400">Error loading graph: {error.message}</p>;
//     if (!graphData) return <p className="text-gray-400">No transaction data to display.</p>;

//     return (
//         <div className="h-96 w-full rounded-lg border border-gray-700 bg-gray-900/50">
//              <ReactFlow nodes={nodes} edges={edges} fitView>
//                 <MiniMap />
//                 <Controls />
//                 <Background />
//             </ReactFlow>
//         </div>
//     );
// };

// const InvestigationWorkspace = () => {
//     const { caseId } = useParams(); // This is the personId

//     // Fetch the main case data from Firestore via our backend
//     const { data: caseData, loading, error } = useFetchData(`/cases/${caseId}`);

//     if (loading) return <Loader />;

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
//                 <div className="text-center">
//                     <ShieldX className="h-16 w-16 text-red-500 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold text-red-400">Failed to Load Case Data</h2>
//                     <p className="text-gray-400 mt-2">{error.message}</p>
//                 </div>
//             </div>
//         );
//     }

//     const personDetails = caseData?.risk_profile?.person_details;

//     return (
//         <div className="flex h-screen bg-gray-900 text-white font-sans">
//             <Sidebar />
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <Header />
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900/50 p-6 pt-24">
//                     <div className="max-w-7xl mx-auto">
//                         {/* Page Header */}
//                         <div className="mb-6 flex items-center space-x-3 animate-fadeIn">
//                             <div className="bg-purple-500/20 p-2 rounded-lg">
//                                 <Files className="h-8 w-8 text-purple-400" />
//                             </div>
//                             <div>
//                                 <h1 className="text-3xl font-bold text-gray-100">Investigation Workspace</h1>
//                                 <p className="text-gray-400">Case ID: {caseId}</p>
//                             </div>
//                         </div>

//                         {/* Core Workspace Components in a Grid Layout */}
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//                             {/* Left Column */}
//                             <div className="lg:col-span-1 space-y-6">
//                                 {/* Case Summary Card */}
//                                 <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
//                                     <div className="flex items-center space-x-3 mb-4">
//                                         <BrainCircuit className="h-7 w-7 text-purple-400" />
//                                         <h2 className="text-xl font-bold">AI Summary & Risk</h2>
//                                     </div>
//                                     <div className="flex justify-between items-center mb-4">
//                                         <span className="font-semibold text-gray-300">Overall Risk Score</span>
//                                         <span className="bg-red-500/20 text-red-300 text-xl font-bold rounded-full h-12 w-12 flex items-center justify-center border-2 border-red-400">
//                                             {caseData?.risk_profile?.final_risk_score}
//                                         </span>
//                                     </div>
//                                     <p className="text-gray-400 text-sm">{caseData?.ai_summary}</p>
//                                 </div>

//                                 {/* Entity Details Card */}
//                                  <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
//                                     <div className="flex items-center space-x-3 mb-4">
//                                         <User className="h-7 w-7 text-purple-400" />
//                                         <h2 className="text-xl font-bold">Subject Details</h2>
//                                     </div>
//                                     <div className="space-y-2 text-sm">
//                                         <p><strong className="text-gray-300 w-24 inline-block">Name:</strong> {personDetails?.full_name}</p>
//                                         <p><strong className="text-gray-300 w-24 inline-block">PAN:</strong> {personDetails?.pan_number}</p>
//                                         <p><strong className="text-gray-300 w-24 inline-block">Salary:</strong> ₹{personDetails?.monthly_salary_inr.toLocaleString('en-IN')} /mo</p>
//                                         <p><strong className="text-gray-300 w-24 inline-block">Address:</strong> {personDetails?.address}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Right Column */}
//                             <div className="lg:col-span-2 space-y-6">
//                                 {/* Network Graph Card */}
//                                 <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
//                                     <div className="flex items-center space-x-3 mb-4">
//                                         <Users className="h-7 w-7 text-purple-400" />
//                                         <h2 className="text-xl font-bold">Transaction Network</h2>
//                                     </div>
//                                     <NetworkGraph personId={caseId} />
//                                 </div>
//                                 {/* Notes Panel - Future enhancement to save notes */}
//                                 <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
//                                      <div className="flex items-center space-x-3 mb-4">
//                                         <StickyNote className="h-7 w-7 text-purple-400" />
//                                         <h2 className="text-xl font-bold">Investigator Notes</h2>
//                                     </div>
//                                     <textarea
//                                         className="w-full h-40 bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
//                                         placeholder="Add your observations, findings, and next steps here..."
//                                     ></textarea>
//                                     <button className="mt-3 w-full bg-purple-600/50 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition">
//                                         Save Notes
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default InvestigationWorkspace;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import Header from '../components/common/Header';
// import Sidebar from '../components/common/Sidebar';
// import Loader from '../components/common/Loader';
// import useFetchData from '../hooks/useFetchData';
// import { Files, User, ShieldX, BrainCircuit, Users, Landmark, Home, StickyNote, Maximize2, Minimize2, AlertOctagon } from 'lucide-react';
// import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow';
// import 'reactflow/dist/style.css';

// // --- Enhanced Network Graph with Animations and Interactivity ---
// const NetworkGraph = ({ personId, isFullscreen = false }) => {
//     const { data: graphData, loading, error } = useFetchData(`/graph/${personId}?limit=25`);
//     const [nodes, setNodes, onNodesChange] = useNodesState([]);
//     const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//     const [selectedNode, setSelectedNode] = useState(null);

//     useEffect(() => {
//         if (graphData) {
//             // Create nodes with enhanced styling and animations
//             const formattedNodes = graphData.nodes.map((node, index) => {
//                 const angle = (index / graphData.nodes.length) * 2 * Math.PI;
//                 const radius = node.isCenter ? 0 : 250;
//                 const x = node.isCenter ? 400 : 400 + radius * Math.cos(angle);
//                 const y = node.isCenter ? 300 : 300 + radius * Math.sin(angle);

//                 return {
//                     id: node.id,
//                     position: { x, y },
//                     data: {
//                         label: node.label,
//                         amount: node.amount || 0,
//                         type: node.type || 'Person'
//                     },
//                     style: {
//                         background: node.isCenter
//                             ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
//                             : node.type === 'Company'
//                                 ? 'linear-gradient(135deg, #be185d 0%, #db2777 100%)'
//                                 : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
//                         color: 'white',
//                         border: node.isCenter ? '3px solid #facc15' : '2px solid rgba(255,255,255,0.2)',
//                         borderRadius: '50%',
//                         width: node.isCenter ? 120 : 80,
//                         height: node.isCenter ? 120 : 80,
//                         fontSize: node.isCenter ? '14px' : '12px',
//                         fontWeight: 'bold',
//                         textAlign: 'center',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         padding: '8px',
//                         boxShadow: node.isCenter
//                             ? '0 0 30px rgba(8, 145, 178, 0.6)'
//                             : '0 4px 15px rgba(0,0,0,0.3)',
//                         transition: 'all 0.3s ease',
//                         cursor: 'pointer',
//                         animation: node.isCenter ? 'pulse 2s infinite' : 'none'
//                     },
//                     type: 'default',
//                     draggable: true,
//                 };
//             });

//             const formattedEdges = graphData.edges.map((edge, i) => ({
//                 id: `e${i}`,
//                 source: edge.source,
//                 target: edge.target,
//                 label: `₹${parseInt(edge.label).toLocaleString('en-IN')}`,
//                 type: 'smoothstep',
//                 animated: true,
//                 markerEnd: {
//                     type: MarkerType.ArrowClosed,
//                     color: '#0891b2',
//                     width: 20,
//                     height: 20
//                 },
//                 style: {
//                     stroke: '#0891b2',
//                     strokeWidth: 3,
//                     filter: 'drop-shadow(0 0 5px rgba(8, 145, 178, 0.5))'
//                 },
//                 labelStyle: {
//                     fill: 'white',
//                     fontWeight: 'bold',
//                     fontSize: '12px'
//                 },
//                 labelBgStyle: {
//                     fill: '#1f2937',
//                     fillOpacity: 0.9,
//                     rx: 4,
//                     ry: 4
//                 },
//             }));

//             setNodes(formattedNodes);
//             setEdges(formattedEdges);
//         }
//     }, [graphData, setNodes, setEdges]);

//     const onNodeClick = (event, node) => {
//         setSelectedNode(node);
//         // Add glow effect to selected node
//         setNodes((nds) =>
//             nds.map((n) => ({
//                 ...n,
//                 style: {
//                     ...n.style,
//                     boxShadow: n.id === node.id
//                         ? '0 0 40px rgba(250, 204, 21, 0.8)'
//                         : n.data.type === 'center'
//                             ? '0 0 30px rgba(8, 145, 178, 0.6)'
//                             : '0 4px 15px rgba(0,0,0,0.3)'
//                 }
//             }))
//         );
//     };

//     if (loading) return (
//         <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//                 <Loader />
//                 <p className="text-gray-400 mt-4">Loading network analysis...</p>
//             </div>
//         </div>
//     );

//     if (error) return (
//         <div className="h-full flex items-center justify-center">
//             <p className="text-red-400">Error loading network: {error.message}</p>
//         </div>
//     );

//     if (!graphData) return (
//         <div className="h-full flex items-center justify-center">
//             <p className="text-gray-400">No transaction network data available.</p>
//         </div>
//     );

//     return (
//         <div className="h-full w-full relative">
//             <style jsx>{`
//                 @keyframes pulse {
//                     0%, 100% { transform: scale(1); }
//                     50% { transform: scale(1.05); }
//                 }
//             `}</style>

//             <ReactFlow
//                 nodes={nodes}
//                 edges={edges}
//                 onNodesChange={onNodesChange}
//                 onEdgesChange={onEdgesChange}
//                 onNodeClick={onNodeClick}
//                 fitView
//                 fitViewOptions={{ padding: 0.1 }}
//                 nodesDraggable={true}
//                 nodesConnectable={false}
//                 elementsSelectable={true}
//                 panOnScroll={true}
//                 zoomOnScroll={true}
//                 zoomOnPinch={true}
//                 zoomOnDoubleClick={true}
//                 className="bg-gray-900/30"
//             >
//                 <Background
//                     color="#4b5563"
//                     gap={20}
//                     size={1}
//                     variant="dots"
//                 />
//                 <Controls
//                     style={{
//                         background: 'rgba(31, 41, 55, 0.8)',
//                         border: '1px solid #374151',
//                         borderRadius: '8px'
//                     }}
//                 />
//                 <MiniMap
//                     style={{
//                         backgroundColor: '#111827',
//                         border: '1px solid #374151',
//                         borderRadius: '8px'
//                     }}
//                     nodeColor={(node) => node.style?.background || '#374151'}
//                     maskColor="rgba(0, 0, 0, 0.6)"
//                 />
//             </ReactFlow>

//             {/* Node Details Overlay */}
//             {selectedNode && (
//                 <div className="absolute top-4 right-4 bg-gray-800/95 border border-gray-600 rounded-lg p-4 min-w-64 backdrop-blur-sm">
//                     <h4 className="font-bold text-white mb-2">{selectedNode.data.label}</h4>
//                     <div className="text-sm text-gray-300 space-y-1">
//                         <p><strong>Type:</strong> {selectedNode.data.type}</p>
//                         <p><strong>ID:</strong> {selectedNode.id}</p>
//                         {selectedNode.data.amount > 0 && (
//                             <p><strong>Amount:</strong> ₹{selectedNode.data.amount.toLocaleString('en-IN')}</p>
//                         )}
//                     </div>
//                     <button
//                         onClick={() => setSelectedNode(null)}
//                         className="mt-3 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white transition"
//                     >
//                         Close
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// const InvestigationWorkspace = () => {
//     const { caseId } = useParams();
//     const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
//     const [notes, setNotes] = useState('');
//     const [savedNotes, setSavedNotes] = useState('');

//     // Fetch the main case data from Firestore via our backend
//     const { data: caseData, loading, error } = useFetchData(`/cases/${caseId}`);

//     const handleSaveNotes = () => {
//         setSavedNotes(notes);
//         // Here you would typically save to backend
//         console.log('Notes saved:', notes);
//     };

//     if (loading) return <Loader />;

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
//                 <div className="text-center">
//                     <ShieldX className="h-16 w-16 text-red-500 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold text-red-400">Failed to Load Case Data</h2>
//                     <p className="text-gray-400 mt-2">{error.message}</p>
//                 </div>
//             </div>
//         );
//     }

//     const personDetails = caseData?.risk_profile?.person_details;
//     const riskProfile = caseData?.risk_profile;

//     return (
//         <div className="flex h-screen bg-gray-900 text-white font-sans ">
//             <Sidebar />
//             <div className="flex-1 flex flex-col overflow-hidden ">
//                 <Header />
//                 <main className="flex-1 overflow-hidden bg-gray-900/50 p-6 pt-24">

//                     <div className="max-w-full mx-auto h-full">
//                         {/* Page Header */}
//                         <div className="mb-6 flex items-center justify-between animate-fadeIn">
//                             <div className="flex items-center space-x-3">
//                                 <div className="bg-purple-500/20 p-2 rounded-lg">
//                                     <Files className="h-8 w-8 text-purple-400" />
//                                 </div>
//                                 <div>
//                                     <h1 className="text-3xl font-bold text-gray-100">Investigation Workspace</h1>
//                                     <p className="text-gray-400">Active Case: {personDetails?.full_name} ({caseId})</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center space-x-4">
//                                 <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
//                                     <span className="text-green-300 font-semibold">Case Active</span>
//                                 </div>
//                                 <button
//                                     onClick={() => setIsGraphFullscreen(!isGraphFullscreen)}
//                                     className="bg-gray-700/50 hover:bg-gray-600 p-2 rounded-lg transition"
//                                     title="Toggle Graph Fullscreen"
//                                 >
//                                     {isGraphFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Main Workspace Layout */}
//                         <div className={`${isGraphFullscreen ? 'h-[calc(100vh-200px)]' : 'grid grid-cols-1 xl:grid-cols-4 gap-10 h-[calc(100vh-200px)]  '}`}>

//                             {/* Left Panel - Information Cards */}
//                             {!isGraphFullscreen && (
//                                 <div className="xl:col-span-1 space-y-4 overflow-y-auto pr-2  ">
//                                     {/* Risk Assessment Card */}
//                                     <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
//                                         <div className="flex items-center space-x-3 mb-4">
//                                             <div className="bg-red-500/20 p-2 rounded-lg">
//                                                 <BrainCircuit className="h-6 w-6 text-red-400" />
//                                             </div>
//                                             <h3 className="text-lg font-bold">Risk Assessment</h3>
//                                         </div>
//                                         <div className="text-center mb-4">
//                                             <div className="relative inline-flex items-center justify-center">
//                                                 <div className="bg-red-500/20 text-red-300 text-2xl font-bold rounded-full h-16 w-16 flex items-center justify-center border-3 border-red-400 animate-pulse">
//                                                     {riskProfile?.final_risk_score}
//                                                 </div>
//                                                 <div className="absolute -inset-2 bg-red-500/10 rounded-full animate-ping"></div>
//                                             </div>
//                                             <p className="text-xs text-gray-400 mt-2">High Risk Alert</p>
//                                         </div>
//                                         <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded-lg">
//                                             {caseData?.ai_summary}
//                                         </div>
//                                     </div>

//                                     {/* Subject Profile Card */}
//                                     <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
//                                         <div className="flex items-center space-x-3 mb-4">
//                                             <div className="bg-blue-500/20 p-2 rounded-lg">
//                                                 <User className="h-6 w-6 text-blue-400" />
//                                             </div>
//                                             <h3 className="text-lg font-bold">Subject Profile</h3>
//                                         </div>
//                                         <div className="space-y-3 text-sm">
//                                             <div className="flex justify-between py-2 border-b border-gray-700/50">
//                                                 <span className="text-gray-400">Name:</span>
//                                                 <span className="font-semibold">{personDetails?.full_name}</span>
//                                             </div>
//                                             <div className="flex justify-between py-2 border-b border-gray-700/50">
//                                                 <span className="text-gray-400">PAN:</span>
//                                                 <span className="font-mono text-cyan-300">{personDetails?.pan_number}</span>
//                                             </div>
//                                             <div className="flex justify-between py-2 border-b border-gray-700/50">
//                                                 <span className="text-gray-400">Salary:</span>
//                                                 <span className="font-semibold text-green-300">
//                                                     ₹{personDetails?.monthly_salary_inr?.toLocaleString('en-IN')} /mo
//                                                 </span>
//                                             </div>
//                                             <div className="py-2">
//                                                 <span className="text-gray-400 block mb-1">Address:</span>
//                                                 <span className="text-sm">{personDetails?.address}</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Investigation Notes */}
//                                     <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
//                                         <div className="flex items-center space-x-3 mb-4">
//                                             <div className="bg-purple-500/20 p-2 rounded-lg">
//                                                 <StickyNote className="h-6 w-6 text-purple-400" />
//                                             </div>
//                                             <h3 className="text-lg font-bold">Investigation Notes</h3>
//                                         </div>
//                                         <textarea
//                                             value={notes}
//                                             onChange={(e) => setNotes(e.target.value)}
//                                             className="w-full h-32 bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none"
//                                             placeholder="Document findings, suspicious patterns, next steps..."
//                                         />
//                                         <button
//                                             onClick={handleSaveNotes}
//                                             className="mt-3 w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
//                                         >
//                                             Save Investigation Notes
//                                         </button>
//                                         {savedNotes && (
//                                             <p className="text-green-400 text-xs mt-2">✓ Notes saved successfully</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Main Graph Panel */}
//                             <div className={`${isGraphFullscreen ? 'col-span-full h-full' : 'xl:col-span-3'} relative`}>
//                                 <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-gray-700/50 backdrop-blur-sm h-full flex flex-col">
//                                     <div className="flex items-center justify-between p-5 border-b border-gray-700/50">
//                                         <div className="flex items-center space-x-3">
//                                             <div className="bg-cyan-500/20 p-2 rounded-lg">
//                                                 <Users className="h-6 w-6 text-cyan-400" />
//                                             </div>
//                                             <div>
//                                                 <h2 className="text-xl font-bold">Transaction Network Analysis</h2>
//                                                 <p className="text-gray-400 text-sm">Interactive network visualization • Drag nodes to explore</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center space-x-2">
//                                             <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
//                                                 <span className="text-green-300 text-xs font-semibold">LIVE</span>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Graph Container */}
//                                     <div className="flex-1 relative">
//                                         <NetworkGraph personId={caseId} isFullscreen={isGraphFullscreen} />

//                                         {/* Graph Controls Overlay */}
//                                         {/* <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
//                                             <h4 className="text-sm font-semibold mb-2 text-gray-200">Graph Controls</h4>
//                                             <div className="text-xs text-gray-400 space-y-1">
//                                                 <p>• Click & drag nodes to reposition</p>
//                                                 <p>• Mouse wheel to zoom</p>
//                                                 <p>• Click nodes for details</p>
//                                                 <p>• Drag canvas to pan</p>
//                                             </div>
//                                         </div> */}

//                                         {/* Legend */}
//                                         <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
//                                             <h4 className="text-sm font-semibold mb-2 text-gray-200">Legend</h4>
//                                             <div className="space-y-2 text-xs">
//                                                 <div className="flex items-center space-x-2">
//                                                     <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 border-2 border-yellow-400"></div>
//                                                     <span className="text-gray-300">Primary Subject</span>
//                                                 </div>
//                                                 <div className="flex items-center space-x-2">
//                                                     <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-500 to-gray-600"></div>
//                                                     <span className="text-gray-300">Person</span>
//                                                 </div>
//                                                 <div className="flex items-center space-x-2">
//                                                     <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-600 to-pink-700"></div>
//                                                     <span className="text-gray-300">Company</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Quick Actions Bar */}
//                         {!isGraphFullscreen && (
//                             <div className="mt-6 bg-gradient-to-r from-gray-800/60 to-gray-900/60 p-4 rounded-xl border border-gray-700/50 backdrop-blur-sm">
//                                 <div className="flex flex-wrap gap-3 justify-center">
//                                     <button className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-4 py-2 rounded-lg transition">
//                                         <Home className="h-4 w-4" />
//                                         <span className="text-sm">Generate Report</span>
//                                     </button>
//                                     <button className="flex items-center space-x-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 px-4 py-2 rounded-lg transition">
//                                         <AlertOctagon className="h-4 w-4" />
//                                         <span className="text-sm">Flag for Review</span>
//                                     </button>
//                                     <button className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 px-4 py-2 rounded-lg transition">
//                                         <Landmark className="h-4 w-4" />
//                                         <span className="text-sm">Export Evidence</span>
//                                     </button>
//                                     <button className="flex items-center space-x-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 px-4 py-2 rounded-lg transition">
//                                         <ShieldX className="h-4 w-4" />
//                                         <span className="text-sm">Close Case</span>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default InvestigationWorkspace;

import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import useFetchData from "../hooks/useFetchData";
import {
  Files,
  User,
  ShieldX,
  BrainCircuit,
  Users,
  StickyNote,
  HelpCircle,
  Maximize2,
  Minimize2,
  Filter,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

// --- Enhanced Network Graph with Advanced Features ---
const NetworkGraph = ({ personId }) => {
  // Fetch more data to make filters more effective
  const {
    data: graphData,
    loading,
    error,
  } = useFetchData(`/graph/${personId}?limit=100`);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // State for advanced filters
  const [filterAmount, setFilterAmount] = useState(0);
  const [direction, setDirection] = useState("all"); // 'all', 'outgoing', 'incoming'
  const [visibleTypes, setVisibleTypes] = useState(["Person", "Company"]);

  const applyFilters = useCallback(() => {
    if (!graphData || !graphData.nodes) return;

    // Filter edges based on amount + direction
    const filteredEdges = graphData.edges.filter((edge) => {
      const amount = parseInt(edge.label.replace(/[^0-9]/g, "")) || 0;
      if (amount < filterAmount) return false;
      if (direction === "outgoing" && !edge.isOutgoing) return false;
      if (direction === "incoming" && edge.isOutgoing) return false;
      return true;
    });

    // Identify (single) center node
    let centerNode = graphData.nodes.find((n) => n.isCenter);
    if (!centerNode && graphData.nodes.length) {
      centerNode = { ...graphData.nodes[0], isCenter: true }; // fallback
    }

    // Collect node IDs that appear in filtered edges
    const connectedIds = new Set();
    filteredEdges.forEach((e) => {
      connectedIds.add(e.source);
      connectedIds.add(e.target);
    });
    if (centerNode) connectedIds.add(centerNode.id);

    // Apply visible type filter but always keep center
    const candidateNodes = graphData.nodes.filter((n) =>
      connectedIds.has(n.id)
    );
    const filteredNodes = candidateNodes.filter(
      (n) => n.id === centerNode.id || visibleTypes.includes(n.type)
    );

    // Separate center and peers
    const peers = filteredNodes.filter((n) => n.id !== centerNode.id);

    // Positioning
    // Place center at origin; peers arranged symmetrically so ReactFlow fitView centers correctly
    const centerPos = { x: 0, y: 0 };
    const radius = 350;
    const formattedNodes = [
      {
        id: centerNode.id,
        position: centerPos,
        data: { label: centerNode.label, type: centerNode.type },
        style: {
          background:
            centerNode.type === "Person"
              ? "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
              : "linear-gradient(135deg, #be185d 0%, #db2777 100%)",
          color: "white",
          border: "4px solid #facc15",
          borderRadius: "50%",
          width: 140,
          height: 140,
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          boxShadow: "0 0 50px rgba(250, 204, 21, 0.55)",
          animation: "pulse 3s infinite",
          cursor: "pointer",
        },
      },
      ...peers.map((node, i) => {
        const angle = (i / (peers.length || 1)) * 2 * Math.PI; // even distribution
        return {
          id: node.id,
          position: {
            x: centerPos.x + radius * Math.cos(angle),
            y: centerPos.y + radius * Math.sin(angle),
          },
          data: { label: node.label, type: node.type },
          style: {
            background:
              node.type === "Person"
                ? "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
                : "linear-gradient(135deg, #be185d 0%, #db2777 100%)",
            color: "white",
            border: "2px solid rgba(255,255,255,0.35)",
            borderRadius: "50%",
            width: 90,
            height: 90,
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            boxShadow: "0 8px 18px rgba(0,0,0,0.45)",
            transition: "transform 0.2s ease-in-out",
            cursor: "pointer",
          },
        };
      }),
    ];

    setNodes(formattedNodes);
    setEdges(
      filteredEdges.map((edge, i) => ({
        id: `e${i}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edge.isOutgoing ? "#10b981" : "#ef4444",
          width: 18,
          height: 18,
        },
        style: {
          stroke: edge.isOutgoing ? "#10b981" : "#ef4444",
          strokeWidth: 2.5,
          opacity: 0.9,
        },
        labelStyle: { fill: "white", fontWeight: "600" },
        labelBgStyle: {
          fill: "#1f2937",
          padding: "3px 6px",
          borderRadius: "4px",
        },
      }))
    );
  }, [graphData, filterAmount, direction, visibleTypes, setNodes, setEdges]);

  useEffect(() => applyFilters(), [applyFilters]);

  const onNodeClick = (event, node) => setSelectedNode(node);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error)
    return (
      <p className="text-red-400 p-4">Error loading graph: {error.message}</p>
    );

  return (
    <div className="h-full w-full relative">
      <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>

      {/* --- NEW: Advanced Filter Panel --- */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600 w-64 animate-fadeIn">
        <h4 className="text-sm font-semibold mb-3 text-gray-200 flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Graph Filters
        </h4>
        <div className="space-y-4">
          <div className="text-xs">
            <label className="block mb-1 text-gray-400">
              Min. Transaction (₹{filterAmount.toLocaleString("en-IN")})
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={filterAmount}
              onChange={(e) => setFilterAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="text-xs">
            <label className="block mb-2 text-gray-400">
              Transaction Direction
            </label>
            <div className="flex bg-gray-900/50 p-1 rounded-md">
              <FilterButton
                active={direction === "all"}
                onClick={() => setDirection("all")}
              >
                All
              </FilterButton>
              <FilterButton
                active={direction === "outgoing"}
                onClick={() => setDirection("outgoing")}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Out
              </FilterButton>
              <FilterButton
                active={direction === "incoming"}
                onClick={() => setDirection("incoming")}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                In
              </FilterButton>
            </div>
          </div>
          <div className="flex space-x-4 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleTypes.includes("Person")}
                onChange={() =>
                  setVisibleTypes((p) =>
                    p.includes("Person")
                      ? p.filter((t) => t !== "Person")
                      : [...p, "Person"]
                  )
                }
                className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500 rounded"
              />
              <span className="text-gray-300">Persons</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleTypes.includes("Company")}
                onChange={() =>
                  setVisibleTypes((p) =>
                    p.includes("Company")
                      ? p.filter((t) => t !== "Company")
                      : [...p, "Company"]
                  )
                }
                className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-pink-600 focus:ring-pink-500 rounded"
              />
              <span className="text-gray-300">Companies</span>
            </label>
          </div>
        </div>
      </div>

      {/* Node Details Overlay */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600 w-64 animate-fadeIn">
          <h4 className="font-bold text-white mb-2">
            {selectedNode.data.label}
          </h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              <strong>Type:</strong> {selectedNode.data.type}
            </p>
            <p>
              <strong>ID:</strong> {selectedNode.id}
            </p>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-3 text-xs w-full bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white transition"
          >
            Close
          </button>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.25 }}
      >
        <MiniMap
          style={{ backgroundColor: "#111827" }}
          nodeColor={(n) => n.style.background}
        />
        <Controls />
        <Background color="#4b5563" gap={24} size={2} />
      </ReactFlow>
    </div>
  );
};

const FilterButton = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`flex-1 flex items-center justify-center text-center px-2 py-1 rounded-sm text-xs transition ${
      active
        ? "bg-cyan-600 text-white font-bold"
        : "hover:bg-gray-700 text-gray-300"
    }`}
  >
    {children}
  </button>
);

// --- Main Workspace Component with Fullscreen Toggle ---
const InvestigationWorkspace = () => {
  const { caseId } = useParams();
  const {
    data: caseData,
    loading,
    error,
  } = useFetchData(
    caseId && !caseId.includes("-placeholder") ? `/cases/${caseId}` : null
  );
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);

  if (!caseId || caseId.includes("-placeholder")) {
    return (
      <div className="flex h-screen bg-gray-900 text-white font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center text-center p-6">
            <div>
              <HelpCircle className="h-24 w-24 text-cyan-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-100 mb-2">
                No Case Selected
              </h1>
              <p className="text-lg text-gray-400 mb-6">
                Please select an alert from the dashboard to begin an
                investigation.
              </p>
              <Link
                to="/dashboard"
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Return to Dashboard
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <ShieldX className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400">
            Failed to Load Case Data
          </h2>
          <p className="text-gray-400 mt-2">{error.message}</p>
        </div>
      </div>
    );

  const personDetails = caseData?.risk_profile?.person_details;
  const riskProfile = caseData?.risk_profile;
  const aiSummary = caseData?.ai_summary;

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900/50 p-6 pt-24">
          <div className="max-w-full mx-auto px-4">
            <div className="mb-6 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Files className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-100">
                    Investigation Workspace
                  </h1>
                  <p className="text-gray-400">Case ID: {caseId}</p>
                </div>
              </div>
              <button
                onClick={() => setIsGraphFullscreen(!isGraphFullscreen)}
                className="bg-gray-700/50 hover:bg-gray-600 p-2 rounded-lg transition"
                title="Toggle Graph Fullscreen"
              >
                {isGraphFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>
            </div>

            <div
              className={`flex flex-col xl:flex-row gap-6 ${
                isGraphFullscreen
                  ? "h-[calc(100vh-10rem)]"
                  : "h-[calc(100vh-12rem)]"
              }`}
            >
              {!isGraphFullscreen && (
                <div className="xl:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
                  <InfoPanel title="AI Summary & Risk" icon={BrainCircuit}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-300">
                        Overall Risk Score
                      </span>
                      <span className="bg-red-500/20 text-red-300 text-xl font-bold rounded-full h-12 w-12 flex items-center justify-center border-2 border-red-400">
                        {riskProfile?.final_risk_score}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{aiSummary}</p>
                  </InfoPanel>
                  <InfoPanel title="Subject Details" icon={User}>
                    <div className="space-y-3 text-sm">
                      <DetailRow
                        label="Name"
                        value={personDetails?.full_name}
                      />
                      <DetailRow
                        label="PAN"
                        value={personDetails?.pan_number}
                      />
                      <DetailRow
                        label="Salary"
                        value={
                          personDetails?.monthly_salary_inr
                            ? `₹${personDetails.monthly_salary_inr.toLocaleString(
                                "en-IN"
                              )} /mo`
                            : "N/A"
                        }
                      />
                      <DetailRow
                        label="Address"
                        value={personDetails?.address}
                      />
                    </div>
                  </InfoPanel>
                  <InfoPanel title="Investigator Notes" icon={StickyNote}>
                    <textarea
                      className="w-full h-48 bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                      placeholder="Add your observations..."
                    ></textarea>
                    <button className="mt-3 w-full bg-purple-600/50 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                      Save Notes
                    </button>
                  </InfoPanel>
                </div>
              )}
              <div
                className={`flex-1 h-full min-h-[500px] ${
                  isGraphFullscreen ? "xl:w-full" : "xl:w-2/3"
                }`}
              >
                <InfoPanel title="Transaction Network" icon={Users} fullHeight>
                  <NetworkGraph personId={caseId} />
                </InfoPanel>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
const InfoPanel = ({ title, icon: Icon, children, fullHeight = false }) => (
  <div
    className={`bg-gray-800/50 rounded-xl border border-gray-700 ${
      fullHeight ? "flex flex-col h-full" : ""
    }`}
  >
    <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
      <Icon className="h-6 w-6 text-purple-400" />
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    <div className={`p-4 ${fullHeight ? "flex-1" : ""}`}>{children}</div>
  </div>
);
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-700/50 py-1">
    <strong className="text-gray-400 font-medium">{label}:</strong>
    <span className="text-right text-gray-200">{value}</span>
  </div>
);
export default InvestigationWorkspace;
