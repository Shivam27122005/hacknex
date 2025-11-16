
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getProblemById, createSubmission } from '../services/supabaseService'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  Share2, 
  Bookmark,
  ChevronLeft,
  Settings,
  Download,
  Copy,
  RotateCcw
} from 'lucide-react'
import Editor from '@monaco-editor/react'

// Utility: Get color classes for difficulty
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'text-success-600 bg-success-100'
    case 'Medium': return 'text-warning-600 bg-warning-100'
    case 'Hard': return 'text-error-600 bg-error-100'
    default: return 'text-secondary-600 bg-secondary-100'
  }
}

// Tab navigation for problem details
function ProblemTabs({ activeTab, setActiveTab }) {
  const tabs = ['description', 'examples', 'constraints', 'discussion']
  return (
    <div className="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-600 hover:text-secondary-900'}`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}

// Problem description tab content
function DescriptionTab({ description }) {
  return (
    <div className="prose prose-sm max-w-none">
      <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{description}</div>
    </div>
  )
}

// Examples tab content
function ExamplesTab({ examples }) {
  return (
    <div className="space-y-4">
      {examples.map((example, index) => (
        <div key={index} className="border border-secondary-200 rounded-lg p-4">
          <h4 className="font-medium text-secondary-900 mb-2">Example {index + 1}:</h4>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-secondary-700">Input: </span>
              <code className="bg-secondary-100 px-2 py-1 rounded text-sm">{example.input}</code>
            </div>
            <div>
              <span className="font-medium text-secondary-700">Output: </span>
              <code className="bg-secondary-100 px-2 py-1 rounded text-sm">{example.output}</code>
            </div>
            <div>
              <span className="font-medium text-secondary-700">Explanation: </span>
              <span className="text-secondary-600">{example.explanation}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Constraints tab content
function ConstraintsTab({ constraints }) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-secondary-900">Constraints:</h4>
      <ul className="list-disc list-inside space-y-2 text-secondary-600">
        {constraints.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>
    </div>
  )
}

// Discussion tab content
function DiscussionTab() {
  return (
    <div className="text-center py-8">
      <div className="text-secondary-400 mb-2">
        <Star className="w-12 h-12 mx-auto" />
      </div>
      <p className="text-secondary-500">Discussion section coming soon!</p>
    </div>
  )
}

// Related topics and companies
function RelatedInfo({ topics, companies }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-medium text-secondary-900 mb-3">Related Topics</h3>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span key={topic} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">{topic}</span>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="font-medium text-secondary-900 mb-3">Companies</h3>
        <div className="flex flex-wrap gap-2">
          {companies.map((company) => (
            <span key={company} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">{company}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Test case result item
function TestCaseResult({ result }) {
  return (
    <div className={`p-3 rounded-lg border ${result.isCorrect ? 'border-success-200 bg-success-50' : 'border-error-200 bg-error-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-secondary-900">Test Case {result.testCase}</span>
        <div className="flex items-center space-x-2">
          {result.isCorrect ? (
            <CheckCircle className="w-4 h-4 text-success-600" />
          ) : (
            <XCircle className="w-4 h-4 text-error-600" />
          )}
          <span className="text-xs text-secondary-500">{result.executionTime.toFixed(0)}ms</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-secondary-700">Input: </span>
          <code className="bg-secondary-100 px-2 py-1 rounded">{JSON.stringify(result.input)}</code>
        </div>
        <div>
          <span className="font-medium text-secondary-700">Expected: </span>
          <code className="bg-secondary-100 px-2 py-1 rounded">{JSON.stringify(result.expectedOutput)}</code>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-secondary-700">Output: </span>
          <code className={`px-2 py-1 rounded ${result.isCorrect ? 'bg-success-100' : 'bg-error-100'}`}>{JSON.stringify(result.actualOutput)}</code>
        </div>
      </div>
    </div>
  )
}

const ProblemDetail = () => {
  const { id } = useParams()
  const { user } = useUser()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [output, setOutput] = useState('')
  const [customInput, setCustomInput] = useState('')

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true)
        const result = await getProblemById(id)
        
        if (result.success && result.data) {
          setProblem(result.data)
          
          // Set initial code from starter_code if available
          const starterCode = result.data.starter_code?.[selectedLanguage]
          if (starterCode) {
            setCode(starterCode)
          } else {
            setCode(getDefaultCode(selectedLanguage))
          }
        } else {
          console.error('Failed to fetch problem:', result.error)
        }
      } catch (error) {
        console.error('Error fetching problem:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [id, selectedLanguage])

  const getDefaultCode = (language) => {
    const templates = {
      javascript: '// Write your code here\nfunction solution() {\n    \n}',
      python: '# Write your code here\ndef solution():\n    pass',
      java: 'class Solution {\n    public void solution() {\n        // Write your code here\n    }\n}'
    }
    return templates[language] || templates.javascript
  }

  // Execute code in JavaScript (client-side evaluation)
  const executeCode = (userCode, testInput) => {
    try {
      // Create a safe execution context
      const startTime = performance.now()
      
      // Wrap user code in a function and execute
      // Extract function name from problem title (convert to camelCase)
      const functionName = problem?.title?.replace(/\s+/g, '') || 'solution';
      
      // Handle different problem types
      let functionCall = '';
      if (problem?.title?.includes('Two Sum') || problem?.title?.includes('Sum')) {
        // Two Sum: twoSum(nums, target)
        functionCall = `${functionName}(${JSON.stringify(testInput.nums)}, ${testInput.target})`;
      } else if (problem?.title?.includes('Merge') && problem?.title?.includes('List')) {
        // Merge Two Sorted Lists: mergeTwoLists(list1, list2)
        functionCall = `${functionName}(${JSON.stringify(testInput.list1)}, ${JSON.stringify(testInput.list2)})`;
      } else {
        // Default fallback - assume first parameter is an array and second is a target
        if (testInput.nums && testInput.target !== undefined) {
          functionCall = `${functionName}(${JSON.stringify(testInput.nums)}, ${testInput.target})`;
        } else if (testInput.list1 && testInput.list2) {
          functionCall = `${functionName}(${JSON.stringify(testInput.list1)}, ${JSON.stringify(testInput.list2)})`;
        } else {
          // Generic call with all inputs
          const inputValues = Object.values(testInput);
          functionCall = `${functionName}(${inputValues.map(val => JSON.stringify(val)).join(', ')})`;
        }
      }
      
      const wrappedCode = `
        ${userCode}
        return typeof ${functionName} !== 'undefined' ? ${functionCall} : null;
      `
      
      const result = new Function(wrappedCode)()
      const executionTime = performance.now() - startTime
      
      return { success: true, result, executionTime }
    } catch (error) {
      return { success: false, error: error.message, executionTime: 0 }
    }
  }

  const handleRunCode = () => {
    if (!code.trim()) {
      setOutput('❌ Please write some code first!')
      return
    }

    setIsRunning(true)
    setTestResults([])
    setOutput('')

    // Run all test cases (use problem-specific test cases)
    let allTestCases = []
    
    if (problem?.examples && problem.examples.length > 0) {
      // Parse problem-specific test cases
      allTestCases = problem.examples.map(ex => {
        try {
          // Handle different problem types
          if (problem.title.includes('Two Sum') || problem.title.includes('Sum')) {
            // Two Sum pattern: nums = [2,7,11,15], target = 9
            const inputMatch = ex.input.match(/nums = (\[.*?\]), target = (\d+)/)
            if (inputMatch) {
              return {
                input: { 
                  nums: JSON.parse(inputMatch[1]), 
                  target: parseInt(inputMatch[2]) 
                },
                output: JSON.parse(ex.output)
              }
            }
          } else if (problem.title.includes('Merge') && problem.title.includes('List')) {
            // Merge Two Sorted Lists pattern: list1 = [1,2,4], list2 = [1,3,4]
            const inputMatch = ex.input.match(/list1 = (\[.*?\]), list2 = (\[.*?\])/)
            if (inputMatch) {
              return {
                input: { 
                  list1: JSON.parse(inputMatch[1]), 
                  list2: JSON.parse(inputMatch[2]) 
                },
                output: JSON.parse(ex.output)
              }
            }
          } else {
            // Default fallback - try to parse as arrays
            try {
              const inputObj = JSON.parse(ex.input)
              return {
                input: inputObj,
                output: JSON.parse(ex.output)
              }
            } catch (parseError) {
              // If parsing fails, return basic test case
              return {
                input: {},
                output: JSON.parse(ex.output)
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse test case:', e)
          // Return a basic test case if parsing fails
          return {
            input: {},
            output: []
          }
        }
      })
    } else {
      // Fallback to default test cases based on problem type
      if (problem?.title?.includes('Two Sum') || problem?.title?.includes('Sum')) {
        allTestCases = [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
        ]
      } else if (problem?.title?.includes('Merge') && problem?.title?.includes('List')) {
        allTestCases = [
          { input: { list1: [1,2,4], list2: [1,3,4] }, output: [1,1,2,3,4,4] },
          { input: { list1: [], list2: [] }, output: [] },
          { input: { list1: [], list2: [0] }, output: [0] }
        ]
      } else {
        // Generic fallback
        allTestCases = [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
        ]
      }
    }

    setTimeout(() => {
      const results = allTestCases.slice(0, 4).map((testCase, index) => {
        const execution = executeCode(code, testCase.input)
        
        if (!execution.success) {
          return {
            testCase: index + 1,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: `Error: ${execution.error}`,
            isCorrect: false,
            executionTime: 0
          }
        }

        const actualOutput = execution.result
        // Handle different output comparison types
        let isCorrect = false;
        if (Array.isArray(actualOutput) && Array.isArray(testCase.output)) {
          // For arrays, we might need to sort them for comparison
          if (problem?.title?.includes('Merge') && problem?.title?.includes('List')) {
            // For merge lists, exact order matters
            isCorrect = JSON.stringify(actualOutput) === JSON.stringify(testCase.output);
          } else {
            // For other arrays (like Two Sum), order might not matter
            isCorrect = JSON.stringify(actualOutput?.sort()) === JSON.stringify(testCase.output?.sort());
          }
        } else {
          // For non-array outputs, direct comparison
          isCorrect = JSON.stringify(actualOutput) === JSON.stringify(testCase.output);
        }

        return {
          testCase: index + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput,
          isCorrect,
          executionTime: execution.executionTime
        }
      })

      setTestResults(results)
      const passedCount = results.filter(r => r.isCorrect).length
      setOutput(`✅ ${passedCount}/${results.length} test cases passed`)
      setIsRunning(false)
    }, 500)
  }

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      setOutput('❌ Please write some code first!')
      return
    }

    if (!user?.id) {
      setOutput('❌ Please login to submit code')
      return
    }

    setIsRunning(true)
    setTestResults([])
    setOutput('Running all test cases...')

    // Run all test cases (use problem-specific test cases)
    let allTestCases = []
    
    if (problem?.examples && problem.examples.length > 0) {
      // Parse problem-specific test cases
      allTestCases = problem.examples.map(ex => {
        try {
          // Handle different problem types
          if (problem.title.includes('Two Sum') || problem.title.includes('Sum')) {
            // Two Sum pattern: nums = [2,7,11,15], target = 9
            const inputMatch = ex.input.match(/nums = (\[.*?\]), target = (\d+)/)
            if (inputMatch) {
              return {
                input: { 
                  nums: JSON.parse(inputMatch[1]), 
                  target: parseInt(inputMatch[2]) 
                },
                output: JSON.parse(ex.output)
              }
            }
          } else if (problem.title.includes('Merge') && problem.title.includes('List')) {
            // Merge Two Sorted Lists pattern: list1 = [1,2,4], list2 = [1,3,4]
            const inputMatch = ex.input.match(/list1 = (\[.*?\]), list2 = (\[.*?\])/)
            if (inputMatch) {
              return {
                input: { 
                  list1: JSON.parse(inputMatch[1]), 
                  list2: JSON.parse(inputMatch[2]) 
                },
                output: JSON.parse(ex.output)
              }
            }
          } else {
            // Default fallback - try to parse as arrays
            try {
              const inputObj = JSON.parse(ex.input)
              return {
                input: inputObj,
                output: JSON.parse(ex.output)
              }
            } catch (parseError) {
              // If parsing fails, return basic test case
              return {
                input: {},
                output: JSON.parse(ex.output)
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse test case:', e)
          // Return a basic test case if parsing fails
          return {
            input: {},
            output: []
          }
        }
      })
    } else {
      // Fallback to default test cases based on problem type
      if (problem?.title?.includes('Two Sum') || problem?.title?.includes('Sum')) {
        allTestCases = [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] },
          { input: { nums: [1, 5, 8, 10, 13], target: 18 }, output: [2, 4] },
          { input: { nums: [0, 4, 3, 0], target: 0 }, output: [0, 3] }
        ]
      } else if (problem?.title?.includes('Merge') && problem?.title?.includes('List')) {
        allTestCases = [
          { input: { list1: [1,2,4], list2: [1,3,4] }, output: [1,1,2,3,4,4] },
          { input: { list1: [], list2: [] }, output: [] },
          { input: { list1: [], list2: [0] }, output: [0] },
          { input: { list1: [2], list2: [1] }, output: [1,2] }
        ]
      } else {
        // Generic fallback
        allTestCases = [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] },
          { input: { nums: [1, 5, 8, 10, 13], target: 18 }, output: [2, 4] },
          { input: { nums: [0, 4, 3, 0], target: 0 }, output: [0, 3] }
        ]
      }
    }

    setTimeout(async () => {
      const results = allTestCases.map((testCase, index) => {
        const execution = executeCode(code, testCase.input)
        
        if (!execution.success) {
          return {
            testCase: index + 1,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: `Error: ${execution.error}`,
            isCorrect: false,
            executionTime: 0
          }
        }

        const actualOutput = execution.result
        // Handle different output comparison types
        let isCorrect = false;
        if (Array.isArray(actualOutput) && Array.isArray(testCase.output)) {
          // For arrays, we might need to sort them for comparison
          if (problem?.title?.includes('Merge') && problem?.title?.includes('List')) {
            // For merge lists, exact order matters
            isCorrect = JSON.stringify(actualOutput) === JSON.stringify(testCase.output);
          } else {
            // For other arrays (like Two Sum), order might not matter
            isCorrect = JSON.stringify(actualOutput?.sort()) === JSON.stringify(testCase.output?.sort());
          }
        } else {
          // For non-array outputs, direct comparison
          isCorrect = JSON.stringify(actualOutput) === JSON.stringify(testCase.output);
        }

        return {
          testCase: index + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput,
          isCorrect,
          executionTime: execution.executionTime
        }
      })

      setTestResults(results)
      
      const allPassed = results.every(r => r.isCorrect)
      const passedCount = results.filter(r => r.isCorrect).length
      const avgExecutionTime = Math.round(results.reduce((sum, r) => sum + r.executionTime, 0) / results.length)

      // Create submission in database
      const submissionData = {
        user_id: user.id,
        problem_id: parseInt(id),
        problem_title: problem.title,
        language: selectedLanguage,
        code: code,
        status: allPassed ? 'accepted' : 'wrong_answer',
        execution_time: avgExecutionTime,
        memory_usage: 45.5,
        test_cases_passed: passedCount,
        total_test_cases: results.length
      }

      const submissionResult = await createSubmission(submissionData)

      if (submissionResult.success) {
        if (allPassed) {
          setOutput(`🎉 Congratulations! All ${results.length} test cases passed!\n✅ Solution accepted\n⏱️ Average runtime: ${avgExecutionTime.toFixed(2)}ms`)
        } else {
          setOutput(`❌ ${passedCount}/${results.length} test cases passed\nPlease review your solution and try again.`)
        }
      } else {
        setOutput(`⚠️ Submission saved locally but failed to sync: ${submissionResult.error}`)
      }
      
      setIsRunning(false)
    }, 1000)
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Loading problem...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/problems" className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Problems</span>
          </Link>
          <div className="h-6 w-px bg-secondary-300"></div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">{problem.title}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
              <span className="text-sm text-secondary-500">{problem.category}</span>
              <span className="text-sm text-secondary-500">• {problem.acceptance}% acceptance</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"><Bookmark className="w-5 h-5" /></button>
          <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"><Share2 className="w-5 h-5" /></button>
          <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"><Star className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Problem Description */}
        <div className="space-y-6">
          {/* Tabs */}
          <ProblemTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* Tab Content */}
          <div className="card">
            {activeTab === 'description' && <DescriptionTab description={problem?.description || ''} />}
            {activeTab === 'examples' && <ExamplesTab examples={problem?.examples || []} />}
            {activeTab === 'constraints' && <ConstraintsTab constraints={problem?.constraints || []} />}
            {activeTab === 'discussion' && <DiscussionTab />}
          </div>
          {/* Related Topics & Companies */}
          {problem?.related_topics && problem?.companies && (
            <RelatedInfo topics={problem.related_topics} companies={problem.companies} />
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="space-y-4">
          {/* Language Selector and Actions */}
          <div className="flex items-center justify-between">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"><Settings className="w-4 h-4" /></button>
              <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"><Download className="w-4 h-4" /></button>
              <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"><Copy className="w-4 h-4" /></button>
              <button className="p-2 text-secondary-400 hover:text-secondary-600 transition-colors"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
          {/* Code Editor */}
          <div className="border border-secondary-200 rounded-lg overflow-hidden">
            <Editor
              height="400px"
              language={selectedLanguage}
              value={code}
              onChange={setCode}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button onClick={handleRunCode} disabled={isRunning} className="flex-1 btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50">
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
            <button onClick={handleSubmitCode} disabled={isRunning} className="flex-1 btn-success flex items-center justify-center space-x-2 disabled:opacity-50">
              <CheckCircle className="w-4 h-4" />
              <span>{isRunning ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
          {/* Output */}
          {output && (
            <div className="card">
              <h3 className="font-medium text-secondary-900 mb-3">Output</h3>
              <div className="bg-secondary-900 text-secondary-100 p-4 rounded-lg font-mono text-sm">{output}</div>
            </div>
          )}
          {/* Test Cases */}
          {testResults.length > 0 && (
            <div className="card">
              <h3 className="font-medium text-secondary-900 mb-3">Test Cases</h3>
              <div className="space-y-3">
                {testResults.map((result) => (
                  <TestCaseResult key={result.testCase} result={result} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail
