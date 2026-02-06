import React, { useState, useEffect } from 'react';
import { ChevronRight, TrendingUp, Award, Users, Target, Sparkles, CheckCircle, XCircle, BarChart3, User, Loader2, Brain, Zap, CheckSquare, Square, Coins, CreditCard, X } from 'lucide-react';

const parseRemarkData = (remark) => {
  try {
    const result = {
      overallScore: 0,
      maxScore: 95,
      assessment: "",
      strengths: [],
      gaps: [],
      details: {
        relevance: { score: 0, max: 25, percentage: 0, description: "" },
        skills: { score: 0, max: 25, percentage: 0, description: "" },
        education: { score: 0, max: 15, percentage: 0, description: "" },
        impact: { score: 0, max: 15, percentage: 0, description: "" },
        communication: { score: 0, max: 10, percentage: 0, description: "" },
        language: { score: 0, max: 5, percentage: 0, description: "" },
        adaptability: { score: 0, max: 5, percentage: 0, description: "" }
      }
    };

    
    const overallScoreMatch = remark.match(/OVERALL SCORE:\s*(\d+)\/(\d+)/);
    if (overallScoreMatch) {
      result.overallScore = parseInt(overallScoreMatch[1]);
      result.maxScore = parseInt(overallScoreMatch[2]);
    }

    const assessmentMatch = remark.match(/OVERALL ASSESSMENT:\s*---------------------------\s*([\s\S]*?)\s*\n\s*\nKEY STRENGTHS:/);
    if (assessmentMatch) {
      result.assessment = assessmentMatch[1].trim();
    }

    const strengthsMatch = remark.match(/KEY STRENGTHS:\s*----------------------\s*([\s\S]*?)\s*\n\s*\nKEY GAPS:/);
    if (strengthsMatch) {
      const strengthsText = strengthsMatch[1];
      const bulletPoints = strengthsText.match(/•\s*([^\n]+)/g);
      if (bulletPoints) {
        result.strengths = bulletPoints.map(point => point.replace(/^•\s*/, '').trim());
      }
    }

    const gapsMatch = remark.match(/KEY GAPS:\s*------------------\s*([\s\S]*?)\s*\n\s*\nDETAILED EVALUATIONS:/);
    if (gapsMatch) {
      const gapsText = gapsMatch[1];
      const bulletPoints = gapsText.match(/•\s*([^\n]+)/g);
      if (bulletPoints) {
        result.gaps = bulletPoints.map(point => point.replace(/^•\s*/, '').trim());
      }
    }

    const evaluationsMatch = remark.match(/DETAILED EVALUATIONS:\s*-----------------------------\s*([\s\S]*)/);
    if (evaluationsMatch) {
      const evaluationsText = evaluationsMatch[1];
      
      const categories = [
        { name: 'Relevance Of Experience', key: 'relevance' },
        { name: 'Skills And Tools', key: 'skills' },
        { name: 'Education And Certifications', key: 'education' },
        { name: 'Impact And Achievements', key: 'impact' },
        { name: 'Communication And Collaboration', key: 'communication' },
        { name: 'Language Proficiency', key: 'language' },
        { name: 'Adaptability And Growth', key: 'adaptability' }
      ];

      categories.forEach(category => {
        const regex = new RegExp(`${category.name}:\\s*(\\d+)/(\\d+)\\s*\\((\\d+)%\\)\\s*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z]|$)`);
        const match = evaluationsText.match(regex);
        
        if (match) {
          result.details[category.key] = {
            score: parseInt(match[1]),
            max: parseInt(match[2]),
            percentage: parseInt(match[3]),
            description: match[4].trim()
          };
        }
      });
    }

    return result;
  } catch (error) {
    console.error("Error parsing remark data:", error);
    return null;
  }
};

const formatExperienceSummary = (workExperience, technicalQualification) => {
  let years = "";
  if (workExperience) {
    const yearsMatch = workExperience.match(/(\d+)\s*(?:years?|yrs?)/i);
    if (yearsMatch) {
      years = `${yearsMatch[1]} years`;
    } else {
      years = workExperience;
    }
  } else {
    years = "Experience not specified";
  }
  
  let skills = "";
  if (technicalQualification) {
    skills = technicalQualification.replace(/\s+and\s+/gi, ',')
                                  .split(',')
                                  .map(skill => skill.trim())
                                  .filter(skill => skill.length > 0)
                                  .join(', ');
  } else {
    skills = "Skills not specified";
  }
  
  // Combine years and skills
  if (years !== "Experience not specified" && skills !== "Skills not specified") {
    return `${years}, ${skills}`;
  } else if (years !== "Experience not specified") {
    return years;
  } else if (skills !== "Skills not specified") {
    return skills;
  } else {
    return "Experience details not specified";
  }
};

const transformApiData = (apiData) => {
  try {
    const headerData = JSON.parse(apiData[0].noheader);
    
    return headerData.data.map((candidate, index) => {
      const parsedData = parseRemarkData(candidate.remark);
      console.log("parsedRemark===>", parsedData)
      
       const summary = formatExperienceSummary(candidate.work_experience, candidate.technical_qualification);
      
      return {
        id: index + 1,
        name: candidate.candidate_name,
        position: candidate.vacancy_applied_for,
        overallScore: parsedData ? parsedData.overallScore : 0,
        maxScore: parsedData ? parsedData.maxScore : 95,                                       
        summary: summary,
        assessment: parsedData ? parsedData.assessment : "Assessment not available",
        strengths: parsedData ? parsedData.strengths : [],
        gaps: parsedData ? parsedData.gaps : [],
        details: parsedData ? parsedData.details : {
          relevance: { score: 0, max: 25, percentage: 0, description: "No data available" },
          skills: { score: 0, max: 25, percentage: 0, description: "No data available" },
          education: { score: 0, max: 15, percentage: 0, description: "No data available" },
          impact: { score: 0, max: 15, percentage: 0, description: "No data available" },
          communication: { score: 0, max: 10, percentage: 0, description: "No data available" },
          language: { score: 0, max: 5, percentage: 0, description: "No data available" },
          adaptability: { score: 0, max: 5, percentage: 0, description: "No data available" }
        }
      };
    });
  } catch (error) {
    console.error("Error transforming API data:", error);
    return [];
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(''); 
  const [candidatesData, setCandidatesData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showLowCoinsModal, setShowLowCoinsModal] = useState(false);

  useEffect(() => {
    if (currentPage === 'list') {
      getCoins();
    }
  }, [currentPage]);

  async function getCoins() {
    console.log("inside the getcoins")
   
    try {
      console.log("inside the api call ")
      const response = await fetch("https://strategicerp.centiloquy.com/runtime/webhook/3f276f3d-03b8-47d7-89dc-3bdeaaedc55f/webhookTrigger/70efef98-5f2c-42fc-9b2d-76da25f991e8", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          server: window.location.hostname.split(".")[0] ?? "t29",
          cloudcode : window.top.document.forms[0]?.cloudcode?.value || "",
          company_name: "CvAnalyzer"
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Data from the api call", data?.sum)
      setCoins(data?.sum)
    } catch (err) {
      alert("Server error in fetching the coins");
      console.log("Error occurred fetching coins:", err);
      throw err; 
    }
  }

  const transformComparisonData = (apiResponse, candidatesData) => {
  try {
    const { structuredLlmOutput } = apiResponse;
    
    const ranking = structuredLlmOutput.final_ranking.map((candidateName, index) => {

      const cleanName = candidateName.replace(/^#\d+\s*/, '');
      const candidate = candidatesData.find(c => c.name === cleanName);
      return {
        rank: index + 1,
        candidate: cleanName,
        score: candidate ? candidate.overallScore : 0
      };
    });
    
    const topStrengths = structuredLlmOutput.top_strengths.map(strength => ({
      candidate: strength.candidate_name.replace(/^#\d+\s*/, '') || "Unknown",
      strength: strength.strength || "Strength not specified"
    }));
    
    return {
      recommended: structuredLlmOutput.recommended_candidate.replace(/^#\d+\s*/, '') || "No recommendation available",
      topStrengths,
      differences: structuredLlmOutput.key_comparative_differences || [],
      ranking,
      whyWinner: structuredLlmOutput.winner_advantages || []
    };
  } catch (error) {
    console.error("Error transforming comparison data:", error);
    return null;
  }
};

  useEffect(() => {
    const fetchData = async () => {
     const serverCode = window.location.hostname.split(".")[0] ?? "t29"
     const cloudCode =  window.top.document.forms[0]?.cloudcode?.value || ""
     const companyname = window.top.document.querySelector("#field31854")?.value  || ""
     const vacancyAppliedFor = window.top.document.querySelector("#field18401")?.value || ""

     
     try {
        setIsLoading(true);
        setLoadingType('data');
        
        const responseData = await fetch(`https://${serverCode}.strategicerpcloud.com/getFunction.do?actn=getsqljsondatawebsite&sqlfieldid=get_candidate_details&cloudcode=${cloudCode}&ids=valuestring/&valuestring=GET_BASIC@@${companyname}@@${vacancyAppliedFor}`, {
          method: "GET"
        });

        const apiData = await responseData.json();
        console.log("whole data from api =======>", apiData);
        
        const transformedData = transformApiData(apiData);
        setCandidatesData(transformedData);
        setDataLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const viewDetails = (candidate) => {
    setLoadingType('details');
    setIsLoading(true);
    
    setTimeout(() => {
      setSelectedCandidate(candidate);
      setCurrentPage('details');
      setIsLoading(false);
    }, 1500);
  };

  const handleRecharge = () => {
   
        var form = document.createElement("form");
        form.method = "POST";
        form.action = window.location.origin + "/pages/payment_gateway/updateBalance.jsp";
        form.target = "_blank";  // Open in new tab
    
      const firstname = window.top.document.forms[0]['username'].value.split(' ')[0]
      const cloudcode = window.top.document.forms[0]['cloudcode'].value
        var params = {
            firstname: firstname,
            cloudcode: cloudcode
        };
    
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.type = "hidden";
                hiddenField.name = key;
                hiddenField.value = params[key];
                form.appendChild(hiddenField);
            }
        }
    
        document.body.appendChild(form);
        form.submit();  
        document.body.removeChild(form); 
    

  };

  const compareAll = async () => {
    if (candidatesData.length === 0) return;
    
    if (coins <= 2) {
      setShowLowCoinsModal(true);
      return;
    }
    
    setLoadingType('comparison');
    setIsLoading(true);
    
    try {
      const candidatesForApi = candidatesData.map(candidate => ({
        name: candidate.name,
        position: candidate.position,
        details: candidate.details
      }));
      
      // Call comparison API
      const response = await fetch('https://strategicerp.centiloquy.com/runtime/webhook/e01a377a-396d-4db3-a9c4-6e9eab1255ff/webhookTrigger/f6a8c083-f8cc-4abc-957b-3908a31c522d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverCode : window.location.hostname.split(".")[0] ?? "t29",
          cloudCode  : window.top.document.forms[0]?.cloudcode?.value || "",
          data: candidatesForApi
        })
      });
      
      const apiResponse = await response.json();
      console.log("Comparison result from API:", apiResponse);
      
      const transformedComparisonData = transformComparisonData(apiResponse, candidatesData);
      console.log("Transformed comparision data =>" , transformedComparisonData)

      
      if (transformedComparisonData) {
        setComparisonData(transformedComparisonData);
        setCurrentPage('comparison');
      } else {
        const sortedCandidates = [...candidatesData].sort((a, b) => b.overallScore - a.overallScore);
        const fallbackData = {
          recommended: `${sortedCandidates[0].name} is best match among candidates with the highest overall score.`,
          topStrengths: sortedCandidates.slice(0, 3).map(candidate => ({
            candidate: candidate.name,
            strength: candidate.strengths[0] || "Strong technical background"
          })),
          differences: [
            `Score gap is notable: ${sortedCandidates[0].name} leads with ${sortedCandidates[0].overallScore}/${sortedCandidates[0].maxScore}`,
            `Technical focus differs among candidates`
          ],
          ranking: sortedCandidates.map((candidate, index) => ({
            rank: index + 1,
            candidate: candidate.name,
            score: candidate.overallScore
          })),
          whyWinner: [
            `${sortedCandidates[0].name} achieves the highest overall score of ${sortedCandidates[0].overallScore}/${sortedCandidates[0].maxScore}`,
            `Demonstrates exceptional ${sortedCandidates[0].strengths[0]?.toLowerCase() || 'technical skills'}`,
            `Shows proven impact through ${sortedCandidates[0].details.impact.description.split('.')[0]}`
          ]
        };
        
        setComparisonData(fallbackData);
        setCurrentPage('comparison');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error comparing candidates:", error);
      setIsLoading(false);
      
       const sortedCandidates = [...candidatesData].sort((a, b) => b.overallScore - a.overallScore);
      const fallbackData = {
        recommended: `${sortedCandidates[0].name} is best match among candidates with the highest overall score.`,
        topStrengths: sortedCandidates.slice(0, 3).map(candidate => ({
          candidate: candidate.name,
          strength: candidate.strengths[0] || "Strong technical background"
        })),
        differences: [
          `Score gap is notable: ${sortedCandidates[0].name} leads with ${sortedCandidates[0].overallScore}/${sortedCandidates[0].maxScore}`,
          `Technical focus differs among candidates`
        ],
        ranking: sortedCandidates.map((candidate, index) => ({
          rank: index + 1,
          candidate: candidate.name,
          score: candidate.overallScore
        })),
        whyWinner: [
          `${sortedCandidates[0].name} achieves the highest overall score of ${sortedCandidates[0].overallScore}/${sortedCandidates[0].maxScore}`,
          `Demonstrates exceptional ${sortedCandidates[0].strengths[0]?.toLowerCase() || 'technical skills'}`,
          `Shows proven impact through ${sortedCandidates[0].details.impact.description.split('.')[0]}`
        ]
      };
      
      setComparisonData(fallbackData);
      setCurrentPage('comparison');
      setIsLoading(false);
    }
  };

  const compareSelected = async () => {
    if (selectedCandidates.length < 2) return;
    
    // Check if user has enough coins
    if (coins <= 2) {
      setShowLowCoinsModal(true);
      return;
    }
    
    setLoadingType('comparison');
    setIsLoading(true);
    
    try {
      // Filter selected candidates
      const filteredCandidates = candidatesData.filter(candidate => 
        selectedCandidates.includes(candidate.id)
      );
      
      const candidatesForApi = filteredCandidates.map(candidate => ({
        name: candidate.name,
        position: candidate.position,
        details: candidate.details
      }));
      
      const response = await fetch('https://strategicerp.centiloquy.com/runtime/webhook/e01a377a-396d-4db3-a9c4-6e9eab1255ff/webhookTrigger/f6a8c083-f8cc-4abc-957b-3908a31c522d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          serverCode : window.location.hostname.split(".")[0] ?? "t29",
          cloudCode  : window.top.document.forms[0]?.cloudcode?.value || "",
          data: candidatesForApi
        })
      });
      
      const apiResponse = await response.json();
      console.log("Comparison result from API:", apiResponse);
      
      const transformedComparisonData = transformComparisonData(apiResponse, candidatesData);
      console.log("Transformed comparision data =>" , transformedComparisonData)
      
     
      
      if (transformedComparisonData) {
        setComparisonData(transformedComparisonData);
        setCurrentPage('comparison');
      } else {
        // Fallback to a basic comparison if transformation fails
        filteredCandidates.sort((a, b) => b.overallScore - a.overallScore);
        
        const fallbackData = {
          recommended: `${filteredCandidates[0].name} is the best match among the selected candidates with the highest overall score.`,
          topStrengths: filteredCandidates.map(candidate => ({
            candidate: candidate.name,
            strength: candidate.strengths[0] || "Strong technical background"
          })),
          differences: [
            `Score gap is notable: ${filteredCandidates[0].name} leads with ${filteredCandidates[0].overallScore}/${filteredCandidates[0].maxScore}`,
            `Technical focus differs among selected candidates`
          ],
          ranking: filteredCandidates.map((candidate, index) => ({
            rank: index + 1,
            candidate: candidate.name,
            score: candidate.overallScore
          })),
          whyWinner: [
            `${filteredCandidates[0].name} achieves the highest overall score of ${filteredCandidates[0].overallScore}/${filteredCandidates[0].maxScore}`,
            `Demonstrates exceptional ${filteredCandidates[0].strengths[0]?.toLowerCase() || 'technical skills'}`,
            `Shows proven impact through ${filteredCandidates[0].details.impact.description.split('.')[0]}`
          ]
        };
        
        setComparisonData(fallbackData);
        setCurrentPage('comparison');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error comparing selected candidates:", error);
      setIsLoading(false);
      
       const filteredCandidates = candidatesData.filter(candidate => 
        selectedCandidates.includes(candidate.id)
      );
      filteredCandidates.sort((a, b) => b.overallScore - a.overallScore);
      
      const fallbackData = {
        recommended: `${filteredCandidates[0].name} is the best match among the selected candidates with the highest overall score.`,
        topStrengths: filteredCandidates.map(candidate => ({
          candidate: candidate.name,
          strength: candidate.strengths[0] || "Strong technical background"
        })),
        differences: [
          `Score gap is notable: ${filteredCandidates[0].name} leads with ${filteredCandidates[0].overallScore}/${filteredCandidates[0].maxScore}`,
          `Technical focus differs among selected candidates`
        ],
        ranking: filteredCandidates.map((candidate, index) => ({
          rank: index + 1,
          candidate: candidate.name,
          score: candidate.overallScore
        })),
        whyWinner: [
          `${filteredCandidates[0].name} achieves the highest overall score of ${filteredCandidates[0].overallScore}/${filteredCandidates[0].maxScore}`,
          `Demonstrates exceptional ${filteredCandidates[0].strengths[0]?.toLowerCase() || 'technical skills'}`,
          `Shows proven impact through ${filteredCandidates[0].details.impact.description.split('.')[0]}`
        ]
      };
      
      setComparisonData(fallbackData);
      setCurrentPage('comparison');
      setIsLoading(false);
    }
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  // Loading Screen Component
  const LoadingScreen = ({ type }) => {
    if (type === 'data') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-block mb-8">
               <div className="absolute inset-0 rounded-full border-8 border-indigo-200 opacity-20 animate-ping"></div>
              
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center animate-spin">
                <div className="absolute inset-2 rounded-full bg-white"></div>
                <User className="w-12 h-12 text-indigo-600 relative z-10" />
              </div>
              
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-indigo-500 rounded-full -translate-x-1/2 -translate-y-2 animate-bounce"></div>
              <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-purple-500 rounded-full -translate-x-1/2 translate-y-2 animate-bounce delay-100"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Candidate Data</h2>
            <p className="text-gray-600 text-lg mb-6">Fetching candidate evaluation data from API...</p>
            
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      );
    }
    
    if (type === 'details') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-block mb-8">
               <div className="absolute inset-0 rounded-full border-8 border-indigo-200 opacity-20 animate-ping"></div>
              
               <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center animate-spin">
                <div className="absolute inset-2 rounded-full bg-white"></div>
                <User className="w-12 h-12 text-indigo-600 relative z-10" />
              </div>
              
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-indigo-500 rounded-full -translate-x-1/2 -translate-y-2 animate-bounce"></div>
              <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-purple-500 rounded-full -translate-x-1/2 translate-y-2 animate-bounce delay-100"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Candidate Details</h2>
            <p className="text-gray-600 text-lg mb-6">Fetching comprehensive evaluation data...</p>
            
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
               <div className="absolute inset-0 rounded-full bg-blue-300 opacity-20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-pink-300 opacity-20 animate-ping delay-75"></div>
              
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-2xl animate-pulse">
                <div className="absolute inset-3 rounded-full bg-white/90 backdrop-blur"></div>
                <Brain className="w-20 h-20 text-purple-600 relative z-10 animate-bounce" />
              </div>
              
               <Sparkles className="absolute top-0 right-0 w-8 h-8 text-yellow-400 animate-spin" />
              <Zap className="absolute bottom-0 left-0 w-8 h-8 text-orange-400 animate-pulse" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Analysis in Progress
            </h2>
            <p className="text-gray-600 text-xl mb-8">Our AI is comparing selected candidates and generating insights...</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="flex items-center gap-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Analyzing Candidate Profiles</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 animate-fadeIn delay-500">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 animate-spin">
                <Loader2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Comparing Skills & Experience</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 animate-fadeIn delay-1000">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-400">Generating Final Recommendations</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gray-300 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 italic">
              💡 Did you know? AI can process candidate data 100x faster than manual review
            </p>
          </div>
        </div>
      </div>
    );
  };

  const CandidateListPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Candidate Evaluations</h1>
              <p className="text-gray-600">Review and compare analyzed candidates</p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleRecharge}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Recharge
              </button>
              
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                <Coins className="w-6 h-6 text-white animate-pulse" />
                <span className="text-white font-bold text-lg">{coins}</span>
              </div>
              
              {selectedCandidates.length >= 2 && (
                <button
                  onClick={compareSelected}
                  disabled={coins <= 0}
                  className={`${
                    coins <= 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  } text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2`}
                >
                  <Sparkles className="w-5 h-5" />
                  Compare {selectedCandidates.length} {selectedCandidates.length === 1 ? 'Candidate' : 'Candidates'}
                </button>
              )}
              <button
                onClick={compareAll}
                disabled={coins <= 0}
                className={`${
                  coins <= 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-purple-700'
                } text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2`}
              >
                <Sparkles className="w-5 h-5" />
                Compare All Candidates
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {candidatesData.map((candidate) => (
            <div
              key={candidate.id}
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 border-l-4 ${
                selectedCandidates.includes(candidate.id) ? 'border-indigo-600 bg-indigo-50' : 'border-indigo-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleCandidateSelection(candidate.id)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {selectedCandidates.includes(candidate.id) ? (
                      <CheckSquare className="w-6 h-6" />
                    ) : (
                      <Square className="w-6 h-6" />
                    )}
                  </button>
                  <div 
                  onClick={() => viewDetails(candidate)}
                  className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full p-3">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 
                    onClick={() => viewDetails(candidate)}
                    id='candidateName' className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                    <p className="text-gray-600 text-sm">{candidate.position} 
                    
                    </p>
                    <div className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-1 inline-block">
                      <p className="text-sm text-indigo-700 font-medium">{candidate.summary}</p>
                    </div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 min-w-[100px]">
                    <div className="text-3xl font-bold text-green-600">
                      {candidate.overallScore}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      out of {candidate.maxScore}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => viewDetails(candidate)}
                  className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800 text-sm">Strengths</span>
                  </div>
                  <div className="text-xs text-gray-700">
                    {candidate.strengths.join(', ')}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-800 text-sm">Gaps</span>
                  </div>
                  <div className="text-xs text-gray-700">
                    {candidate.gaps.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DetailedViewPage = () => {
    if (!selectedCandidate) return null;

    const DetailCard = ({ title, data }) => (
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-indigo-600">{data.score}</span>
            <span className="text-gray-500">/ {data.max}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Performance</span>
            <span className="font-semibold text-indigo-600">{data.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                data.percentage >= 90 ? 'bg-green-500' :
                data.percentage >= 70 ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}
              style={{ width: `${data.percentage}%` }}
            />
          </div>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed">{data.description}</p>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setCurrentPage('list')}
            className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2"
          >
            ← Back to List
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full p-6">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{selectedCandidate.name}</h1>
                  <p className="text-xl text-gray-600 mt-2">{selectedCandidate.position}</p>
                </div>
              </div>
              <div className="text-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 min-w-[160px]">
                <div className="text-6xl font-bold text-green-600">
                  {selectedCandidate.overallScore}
                </div>
                <div className="text-sm text-gray-600 mt-2 uppercase tracking-wide">
                  Overall Score
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  out of {selectedCandidate.maxScore}
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <Award className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Overall Assessment</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedCandidate.assessment}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Key Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {selectedCandidate.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  {selectedCandidate.gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Detailed Evaluation Breakdown</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <DetailCard title="Relevance of Experience" data={selectedCandidate.details.relevance} />
            <DetailCard title="Skills and Tools" data={selectedCandidate.details.skills} />
            <DetailCard title="Education and Certifications" data={selectedCandidate.details.education} />
            <DetailCard title="Impact and Achievements" data={selectedCandidate.details.impact} />
            <DetailCard title="Communication and Collaboration" data={selectedCandidate.details.communication} />
            <DetailCard title="Language Proficiency" data={selectedCandidate.details.language} />
            <DetailCard title="Adaptability and Growth" data={selectedCandidate.details.adaptability} />
          </div>
        </div>
      </div>
    );
  };

  const ComparisonPage = () => {
    if (!comparisonData) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-orange-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentPage('list')}
            className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
          >
            ← Back to List
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-pink-600 rounded-full p-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">AI-Powered Candidate Comparison</h1>
                <p className="text-gray-600 mt-1">Intelligent analysis of selected candidates</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Recommended Candidate</h2>
              </div>
              <p className="text-lg leading-relaxed">{comparisonData.recommended}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-indigo-600" />
                Top Strengths per Candidate
              </h2>
              <div className="space-y-4">
                {comparisonData.topStrengths.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border-l-4 border-indigo-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{item.candidate}</h3>
                        <p className="text-gray-700">{item.strength}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="w-7 h-7 text-orange-600" />
                Key Comparative Differences
              </h2>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 space-y-4">
                {comparisonData.differences.map((diff, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-gray-800 leading-relaxed">{diff}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-blue-600" />
                Final Ranking
              </h2>
              <div className="space-y-3">
                {comparisonData.ranking.map((item) => (
                  <div
                    key={item.rank}
                    className={`rounded-xl p-6 flex items-center justify-between shadow-md ${
                      item.rank === 1
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white scale-105'
                        : item.rank === 2
                        ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900'
                        : 'bg-gradient-to-r from-amber-700 to-orange-800 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full w-14 h-14 flex items-center justify-center font-bold text-2xl ${
                        item.rank === 1 ? 'bg-white text-yellow-600' : 'bg-white/30'
                      }`}>
                        #{item.rank}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{item.candidate}</h3>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">
                      {item.score}/95
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-blue-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-600" />
                Why {comparisonData.ranking[0].candidate} Stands Out
              </h2>
              <div className="space-y-4">
                {comparisonData.whyWinner.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-800 leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Low Coins Modal Component
  const LowCoinsModal = () => {
    if (!showLowCoinsModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Low Coins Balance</h2>
            <button
              onClick={() => setShowLowCoinsModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
              <Coins className="w-10 h-10 text-amber-600" />
            </div>
            <p className="text-gray-700 text-lg">
              You don't have enough coins to compare candidates. You need at least 2 coins to perform this action.
            </p>
            <p className="text-gray-600 mt-2">
              Current balance: <span className="font-bold text-amber-600">{coins} coins</span>
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowLowCoinsModal(false);
                handleRecharge();
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Recharge
            </button>
            <button
              onClick={() => setShowLowCoinsModal(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen type={loadingType} />
      ) : (
        <>
          {currentPage === 'list' && <CandidateListPage />}
          {currentPage === 'details' && <DetailedViewPage />}
          {currentPage === 'comparison' && <ComparisonPage />}
          <LowCoinsModal />
        </>
      )}
    </> 
  );
};

export default App;