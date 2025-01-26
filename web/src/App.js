import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import crowdfundingABI from './utils/contracts/Crowdfunding.json';
//import crowdfundingABI from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';
import projectABI from './utils/contracts/Project.json';
//import projectABI from '../artifacts/contracts/Project.sol/Project.json';
import './App.css';

const crowdfundingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const App = () => {
  const [account, setAccount] = useState(null); // Cont MetaMask conectat
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    minContribution: '',
    deadline: '',
  });

  // Funcția de conectare la MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        alert(`Connected to MetaMask with account: ${accounts[0]}`);
      } catch (err) {
        console.error("Error connecting to MetaMask:", err);
        alert("Failed to connect to MetaMask");
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  // Detectează schimbarea contului MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          alert(`Account switched to: ${accounts[0]}`);
        } else {
          setAccount(null);
          alert("Disconnected from MetaMask");
        }
      });
    }
  }, []);

  const createTestProject = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(crowdfundingAddress, crowdfundingABI.abi, signer);
  
      const tx = await contract.createProject(
        ethers.parseUnits("0.01", "ether"), // minContribution
        Math.round(Date.now()/1000 + 86400), // deadline (24h from now)
        ethers.parseUnits("1", "ether"), // goal
        "Test Project", // title
        "Test Description", // description
        { gasLimit: 3000000 }
      );
  
      console.log('Transaction:', tx);
      await tx.wait();
      fetchProjects();
    } catch (err) {
      console.error('Test project error:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(crowdfundingAddress, crowdfundingABI.abi, signer);
  
      console.log('Fetching projects...'); // Add logging
      const projectAddresses = await contract.returnAllProjects();
      console.log('Project addresses:', projectAddresses); // Check if addresses are returned

      if (projectAddresses.length === 0) {
        console.log('No projects found');
        setLoading(false);
        return;
      }
  
      const projectDetails = await Promise.all(
        projectAddresses.map(async (address) => {
          const project = new ethers.Contract(address, projectABI.abi, signer);
          const details = await project.getProjectDetails();
          
          return { 
            address,
            title: await project.projectTitle(),
            description: await project.projectDes(),
            goal: ethers.formatEther(details.goalAmount),
            raised: ethers.formatEther(details.currentAmount),
            deadline: new Date(Number(details.projectDeadline) * 1000).toLocaleString(),
            state: Number(details.currentState) // 0: Fundraising, 1: Expired, 2: Successful
          };
        })
      );
  
      console.log('Processed projects:', projectDetails);
      setProjects(projectDetails);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load projects');
      setLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(crowdfundingAddress, crowdfundingABI.abi, signer);

      console.log('Form data:', formData); // Add logging
  
      const minContribution = ethers.parseUnits(formData.minContribution, 'ether');
      const goal = ethers.parseUnits(formData.goal, 'ether');
      const deadline = Math.round(new Date(formData.deadline).getTime() / 1000);
  
      const tx = await contract.createProject(
        minContribution, 
        deadline, 
        goal, 
        formData.title, 
        formData.description,
        { gasLimit: 3000000 }
      );
      await tx.wait();
  
      setFormData({
        title: '',
        description: '',
        goal: '',
        minContribution: '',
        deadline: '',
      });
  
      alert('Project created successfully!');
      fetchProjects();
    } catch (err) {
      //console.error(err);
      console.error('Detailed error:', err); // Add detailed error logging
      setError('Failed to create project:');
    }
  };
  

  const contributeToProject = async (address, amount) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(crowdfundingAddress, crowdfundingABI.abi, signer);
      
      const tx = await contract.contribute(address, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      
      alert('Contribution successful!');
      fetchProjects();
    } catch (err) {
      console.error('Contract error:', err);
      alert('Failed to contribute');
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Strangeri de fonduri pentru cauze umanitare</h1>
      
      {/* Conexiune Wallet */}
      <div className="meta-box mb-8 text-center">
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Connect to MetaMask
          </button>
        ) : (
          <p className="text-green-500 bg-green-100 py-2 px-4 rounded inline-block shadow">
          Connected as: <span className="font-bold">{account}</span>
        </p>
        )}
      </div>

      <button 
        onClick={createTestProject} 
        className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 mb-4"
      >
        Create Test Project
      </button>

      {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Formularul de creare */}
        <div className="form-box w-full md:w-1/3 px-4 mb-8 bg-white shadow-lg p-6 rounded">
          <h2 className="text-2xl font-semibold mb-4 text-center">Creaza un proiect pentru o noua cauza</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Titlul proiectului"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="input-short"
            />
            <textarea
              placeholder="Descrierea proiectului"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="input-short"
            ></textarea>
            <input
              type="number"
              step="0.01"
              placeholder="Suma tinta (ETH)"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              required
              className="input-short"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Contributia minima (ETH)"
              value={formData.minContribution}
              onChange={(e) => setFormData({ ...formData, minContribution: e.target.value })}
              required
              className="input-short"
            />
            <input
              type="date"
              placeholder="Deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              className="input-short"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
            >
              Create Project
            </button>
          </form>
        </div>

        {/* Proiectele active */}
        <div className="flex flex-wrap justify-between w-full mt-8">
          <div className="projects-box w-full md:w-[48%] px-4 mb-8 bg-gray-50 shadow p-6 rounded">
            <h2 className="text-2xl font-semibold mb-4">Proiecte active</h2>
            <div className="grid gap-4">
              {projects.filter((p) => p.state === 0).map((project, index) => (
                <div key={index} className="p-4 border rounded shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="mb-2">{project.description}</p>
                  <p className="mb-1">
                    <strong>Goal:</strong> {project.goal} ETH
                  </p>
                  <p className="mb-1">
                    <strong>Raised:</strong> {project.raised} ETH
                  </p>
                  <p className="mb-4">
                    <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount to contribute (ETH)"
                      onChange={(e) => (project.contributionAmount = e.target.value)}
                      className="input-shorter"
                    />
                    <button
                      onClick={() => contributeToProject(project.address, project.contributionAmount)}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                      Contribute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proiectele finalizate */}
          <div className="projects-box w-full md:w-[48%] px-4 mb-8 bg-gray-50 shadow p-6 rounded">
            <h2 className="text-2xl font-semibold mb-4">Proiecte finalizate</h2>
            <div className="grid gap-4">
              {projects.filter((p) => p.state > 0).map((project, index) => (
                <div key={index} className="p-4 border rounded shadow-sm bg-gray-100">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="mb-2">{project.description}</p>
                  <p className="mb-1">
                    <strong>Goal:</strong> {project.goal} ETH
                  </p>
                  <p className="mb-1">
                    <strong>Raised:</strong> {project.raised} ETH
                  </p>
                  <p className="mb-1">
                    <strong>Completed on:</strong> {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

    </div>
  );
};
export default App;
