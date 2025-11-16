-- =====================================================
-- COMPREHENSIVE CODING PROBLEMS DATA
-- Diverse problem set covering multiple categories and difficulty levels
-- =====================================================

-- Clear existing problems to avoid duplicate key conflicts
TRUNCATE TABLE public.problems RESTART IDENTITY CASCADE;

-- =====================================================
-- ARRAY PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

-- Classic Two Sum Problem
(
  'Two Sum',
  'two-sum',
  'Easy',
  'Arrays',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  '[
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      "input": "nums = [3,2,4], target = 6",
      "output": "[1,2]",
      "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
    },
    {
      "input": "nums = [3,3], target = 6",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 6, we return [0, 1]."
    }
  ]'::jsonb,
  ARRAY['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
  ARRAY['Array', 'Hash Table'],
  ARRAY['Amazon', 'Google', 'Apple', 'Microsoft'],
  49.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var twoSum = function(nums, target) {\n    // Your code here\n};",
    "python": "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    # Your code here\n    pass",
    "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}"
  }'::jsonb
),

-- Continue with existing problems

-- Easy Array Problems
(
  'Contains Duplicate',
  'contains-duplicate-arrays',
  'Easy',
  'Arrays',
  'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
  '[
    {
      "input": "nums = [1,2,3,1]",
      "output": "true",
      "explanation": "The element 1 appears twice"
    },
    {
      "input": "nums = [1,2,3,4]",
      "output": "false",
      "explanation": "All elements are distinct"
    }
  ]'::jsonb,
  ARRAY['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
  ARRAY['Array', 'Hash Table', 'Sorting'],
  ARRAY['Google', 'Amazon', 'Apple'],
  73.5,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var containsDuplicate = function(nums) {\n    // Your code here\n};",
    "python": "def containsDuplicate(self, nums: List[int]) -> bool:\n    # Your code here\n    pass",
    "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n    }\n}"
  }'::jsonb
),

(
  'Move Zeroes',
  'move-zeroes',
  'Easy',
  'Arrays',
  'Given an integer array nums, move all 0''s to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.',
  '[
    {
      "input": "nums = [0,1,0,3,12]",
      "output": "[1,3,12,0,0]",
      "explanation": "Move all zeros to the end"
    }
  ]'::jsonb,
  ARRAY['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
  ARRAY['Array', 'Two Pointers'],
  ARRAY['Facebook', 'Microsoft', 'Amazon'],
  82.1,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var moveZeroes = function(nums) {\n    // Your code here\n};",
    "python": "def moveZeroes(self, nums: List[int]) -> None:\n    # Your code here\n    pass"
  }'::jsonb
),

-- Medium Array Problems
(
  'Product of Array Except Self',
  'product-of-array-except-self',
  'Medium',
  'Arrays',
  'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.',
  '[
    {
      "input": "nums = [1,2,3,4]",
      "output": "[24,12,8,6]",
      "explanation": "For index 0: 2*3*4 = 24, for index 1: 1*3*4 = 12, etc."
    }
  ]'::jsonb,
  ARRAY['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
  ARRAY['Array', 'Prefix Sum'],
  ARRAY['Amazon', 'Microsoft', 'Apple'],
  68.4,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var productExceptSelf = function(nums) {\n    // Your code here\n};"
  }'::jsonb
),

(
  '3Sum',
  '3sum',
  'Medium',
  'Arrays',
  'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
  '[
    {
      "input": "nums = [-1,0,1,2,-1,-4]",
      "output": "[[-1,-1,2],[-1,0,1]]",
      "explanation": "The distinct triplets are [-1,0,1] and [-1,-1,2]"
    }
  ]'::jsonb,
  ARRAY['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
  ARRAY['Array', 'Two Pointers', 'Sorting'],
  ARRAY['Facebook', 'Amazon', 'Microsoft'],
  32.8,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var threeSum = function(nums) {\n    // Your code here\n};"
  }'::jsonb
),

-- Hard Array Problem
(
  'Trapping Rain Water',
  'trapping-rain-water',
  'Hard',
  'Arrays',
  'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
  '[
    {
      "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
      "output": "6",
      "explanation": "The elevation map can trap 6 units of rain water"
    }
  ]'::jsonb,
  ARRAY['1 <= height.length <= 2 * 10^4', '0 <= height[i] <= 10^5'],
  ARRAY['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
  ARRAY['Google', 'Amazon', 'Microsoft'],
  58.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var trap = function(height) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- STRING PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Longest Substring Without Repeating Characters',
  'longest-substring-without-repeating-characters',
  'Medium',
  'Strings',
  'Given a string s, find the length of the longest substring without repeating characters.',
  '[
    {
      "input": "s = \"abcabcbb\"",
      "output": "3",
      "explanation": "The answer is \"abc\", with the length of 3"
    },
    {
      "input": "s = \"bbbbb\"",
      "output": "1",
      "explanation": "The answer is \"b\", with the length of 1"
    }
  ]'::jsonb,
  ARRAY['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
  ARRAY['Hash Table', 'String', 'Sliding Window'],
  ARRAY['Amazon', 'Microsoft', 'Google'],
  35.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var lengthOfLongestSubstring = function(s) {\n    // Your code here\n};",
    "python": "def lengthOfLongestSubstring(self, s: str) -> int:\n    # Your code here\n    pass"
  }'::jsonb
),

(
  'Group Anagrams',
  'group-anagrams',
  'Medium',
  'Strings',
  'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
  '[
    {
      "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
      "output": "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
      "explanation": "Group anagrams together"
    }
  ]'::jsonb,
  ARRAY['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
  ARRAY['Hash Table', 'String', 'Sorting'],
  ARRAY['Amazon', 'Google', 'Facebook'],
  67.3,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var groupAnagrams = function(strs) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Palindrome Permutation',
  'palindrome-permutation',
  'Easy',
  'Strings',
  'Given a string s, return true if a permutation of the string could form a palindrome and false otherwise.',
  '[
    {
      "input": "s = \"code\"",
      "output": "false",
      "explanation": "No permutation of \"code\" can form a palindrome"
    },
    {
      "input": "s = \"aab\"",
      "output": "true",
      "explanation": "\"aab\" can be permuted to \"aba\" which is a palindrome"
    }
  ]'::jsonb,
  ARRAY['1 <= s.length <= 5000', 's consists of only lowercase English letters'],
  ARRAY['Hash Table', 'String'],
  ARRAY['Google', 'Facebook'],
  65.8,
  true,
  '[]'::jsonb,
  '{
    "javascript": "var canPermutePalindrome = function(s) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- LINKED LIST PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Merge Two Sorted Lists',
  'merge-two-sorted-lists',
  'Easy',
  'Linked Lists',
  'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
  '[
    {
      "input": "list1 = [1,2,4], list2 = [1,3,4]",
      "output": "[1,1,2,3,4,4]",
      "explanation": "Merge two sorted linked lists"
    }
  ]'::jsonb,
  ARRAY['The number of nodes in both lists is in the range [0, 50]', '-100 <= Node.val <= 100'],
  ARRAY['Linked List', 'Recursion'],
  ARRAY['Amazon', 'Microsoft', 'Apple'],
  61.8,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var mergeTwoLists = function(list1, list2) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Linked List Cycle',
  'linked-list-cycle',
  'Easy',
  'Linked Lists',
  'Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle in the linked list. Otherwise, return false.',
  '[
    {
      "input": "head = [3,2,0,-4], pos = 1",
      "output": "true",
      "explanation": "There is a cycle where the tail connects to the 1st node (0-indexed)"
    }
  ]'::jsonb,
  ARRAY['The number of nodes in the list is in the range [0, 10^4]', '-10^5 <= Node.val <= 10^5'],
  ARRAY['Hash Table', 'Linked List', 'Two Pointers'],
  ARRAY['Amazon', 'Microsoft', 'Bloomberg'],
  48.5,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var hasCycle = function(head) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Remove Nth Node From End of List',
  'remove-nth-node-from-end-of-list',
  'Medium',
  'Linked Lists',
  'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
  '[
    {
      "input": "head = [1,2,3,4,5], n = 2",
      "output": "[1,2,3,5]",
      "explanation": "Remove the 2nd node from the end"
    }
  ]'::jsonb,
  ARRAY['The number of nodes in the list is sz', '1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
  ARRAY['Linked List', 'Two Pointers'],
  ARRAY['Amazon', 'Facebook', 'Microsoft'],
  42.3,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var removeNthFromEnd = function(head, n) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- TREE PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Invert Binary Tree',
  'invert-binary-tree',
  'Easy',
  'Trees',
  'Given the root of a binary tree, invert the tree, and return its root.',
  '[
    {
      "input": "root = [4,2,7,1,3,6,9]",
      "output": "[4,7,2,9,6,3,1]",
      "explanation": "Invert the binary tree"
    }
  ]'::jsonb,
  ARRAY['The number of nodes in the tree is in the range [0, 100]', '-100 <= Node.val <= 100'],
  ARRAY['Tree', 'Depth-First Search', 'Breadth-First Search'],
  ARRAY['Google', 'Amazon', 'Microsoft'],
  74.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var invertTree = function(root) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Validate Binary Search Tree',
  'validate-binary-search-tree',
  'Medium',
  'Trees',
  'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node''s key. The right subtree of a node contains only nodes with keys greater than the node''s key. Both the left and right subtrees must also be binary search trees.',
  '[
    {
      "input": "root = [2,1,3]",
      "output": "true",
      "explanation": "Valid BST"
    }
  ]'::jsonb,
  ARRAY['The number of nodes in the tree is in the range [1, 10^4]', '-2^31 <= Node.val <= 2^31 - 1'],
  ARRAY['Tree', 'Depth-First Search', 'Binary Search Tree'],
  ARRAY['Amazon', 'Facebook', 'Microsoft'],
  32.1,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var isValidBST = function(root) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Lowest Common Ancestor of a Binary Tree',
  'lowest-common-ancestor-of-a-binary-tree',
  'Medium',
  'Trees',
  'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.',
  '[
    {
      "input": "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
      "output": "3",
      "explanation": "The LCA of nodes 5 and 1 is 3"
    }
  ]'::jsonb,
  ARRAY['The number of nodes in the tree is in the range [2, 10^5]', '-10^9 <= Node.val <= 10^9'],
  ARRAY['Tree', 'Depth-First Search', 'Binary Tree'],
  ARRAY['Facebook', 'Amazon', 'Microsoft'],
  58.7,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var lowestCommonAncestor = function(root, p, q) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- DYNAMIC PROGRAMMING PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Coin Change',
  'coin-change',
  'Medium',
  'Dynamic Programming',
  'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
  '[
    {
      "input": "coins = [1,2,5], amount = 11",
      "output": "3",
      "explanation": "11 = 5 + 5 + 1"
    }
  ]'::jsonb,
  ARRAY['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
  ARRAY['Array', 'Dynamic Programming', 'Breadth-First Search'],
  ARRAY['Amazon', 'Google', 'Microsoft'],
  43.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var coinChange = function(coins, amount) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Longest Increasing Subsequence',
  'longest-increasing-subsequence',
  'Medium',
  'Dynamic Programming',
  'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
  '[
    {
      "input": "nums = [10,9,2,5,3,7,101,18]",
      "output": "4",
      "explanation": "The longest increasing subsequence is [2,3,7,101], therefore the length is 4"
    }
  ]'::jsonb,
  ARRAY['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
  ARRAY['Array', 'Binary Search', 'Dynamic Programming'],
  ARRAY['Microsoft', 'Amazon', 'Google'],
  52.8,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var lengthOfLIS = function(nums) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Word Break',
  'word-break',
  'Medium',
  'Dynamic Programming',
  'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
  '[
    {
      "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
      "output": "true",
      "explanation": "Return true because \"leetcode\" can be segmented as \"leet code\""
    }
  ]'::jsonb,
  ARRAY['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20'],
  ARRAY['Hash Table', 'String', 'Dynamic Programming', 'Trie'],
  ARRAY['Amazon', 'Google', 'Facebook'],
  46.5,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var wordBreak = function(s, wordDict) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- GRAPH PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Number of Islands',
  'number-of-islands',
  'Medium',
  'Graphs',
  'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
  '[
    {
      "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
      "output": "3",
      "explanation": "There are 3 islands in the grid"
    }
  ]'::jsonb,
  ARRAY['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is ''0'' or ''1'''],
  ARRAY['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'],
  ARRAY['Amazon', 'Microsoft', 'Facebook'],
  57.8,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var numIslands = function(grid) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Clone Graph',
  'clone-graph',
  'Medium',
  'Graphs',
  'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
  '[
    {
      "input": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
      "output": "[[2,4],[1,3],[2,4],[1,3]]",
      "explanation": "Clone the graph"
    }
  ]'::jsonb,
  ARRAY['The number of nodes in the graph is in the range [0, 100]', '1 <= Node.val <= 100'],
  ARRAY['Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'],
  ARRAY['Facebook', 'Amazon', 'Google'],
  51.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var cloneGraph = function(node) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Course Schedule',
  'course-schedule',
  'Medium',
  'Graphs',
  'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
  '[
    {
      "input": "numCourses = 2, prerequisites = [[1,0]]",
      "output": "true",
      "explanation": "There are 2 courses. To take course 1 you should have finished course 0. So it is possible."
    }
  ]'::jsonb,
  ARRAY['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2'],
  ARRAY['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
  ARRAY['Amazon', 'Microsoft', 'Google'],
  46.3,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var canFinish = function(numCourses, prerequisites) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- GREEDY ALGORITHM PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Jump Game',
  'jump-game',
  'Medium',
  'Greedy',
  'You are given an integer array nums. You are initially positioned at the array''s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
  '[
    {
      "input": "nums = [2,3,1,1,4]",
      "output": "true",
      "explanation": "Jump 1 step from index 0 to 1, then 3 steps to the last index"
    }
  ]'::jsonb,
  ARRAY['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
  ARRAY['Array', 'Dynamic Programming', 'Greedy'],
  ARRAY['Amazon', 'Microsoft', 'Google'],
  38.7,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var canJump = function(nums) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Meeting Rooms II',
  'meeting-rooms-ii',
  'Medium',
  'Greedy',
  'Given an array of meeting time intervals consisting of start and end times, find the minimum number of conference rooms required.',
  '[
    {
      "input": "intervals = [[0,30],[5,10],[15,20]]",
      "output": "2",
      "explanation": "We need 2 meeting rooms"
    }
  ]'::jsonb,
  ARRAY['1 <= intervals.length <= 10^4', '0 <= starti < endi <= 10^6'],
  ARRAY['Array', 'Two Pointers', 'Greedy', 'Sorting', 'Heap'],
  ARRAY['Amazon', 'Facebook', 'Google'],
  50.1,
  true,
  '[]'::jsonb,
  '{
    "javascript": "var minMeetingRooms = function(intervals) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- BACKTRACKING PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Generate Parentheses',
  'generate-parentheses',
  'Medium',
  'Backtracking',
  'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
  '[
    {
      "input": "n = 3",
      "output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
      "explanation": "All combinations of 3 pairs of parentheses"
    }
  ]'::jsonb,
  ARRAY['1 <= n <= 8'],
  ARRAY['String', 'Dynamic Programming', 'Backtracking'],
  ARRAY['Amazon', 'Google', 'Microsoft'],
  72.4,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var generateParenthesis = function(n) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Permutations',
  'permutations',
  'Medium',
  'Backtracking',
  'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.',
  '[
    {
      "input": "nums = [1,2,3]",
      "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      "explanation": "All permutations of [1,2,3]"
    }
  ]'::jsonb,
  ARRAY['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All integers of nums are unique'],
  ARRAY['Array', 'Backtracking'],
  ARRAY['Amazon', 'Microsoft', 'Facebook'],
  75.3,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var permute = function(nums) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- BINARY SEARCH PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Search in Rotated Sorted Array',
  'search-in-rotated-sorted-array',
  'Medium',
  'Binary Search',
  'You are given an integer array nums sorted in ascending order (with distinct values), and an integer target. Suppose that nums is rotated at some pivot. Return the index of target if it is in nums, or -1 if it is not in nums.',
  '[
    {
      "input": "nums = [4,5,6,7,0,1,2], target = 0",
      "output": "4",
      "explanation": "0 is found at index 4"
    }
  ]'::jsonb,
  ARRAY['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique'],
  ARRAY['Array', 'Binary Search'],
  ARRAY['Amazon', 'Microsoft', 'Facebook'],
  39.8,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var search = function(nums, target) {\n    // Your code here\n};"
  }'::jsonb
),

(
  'Find Minimum in Rotated Sorted Array',
  'find-minimum-in-rotated-sorted-array',
  'Medium',
  'Binary Search',
  'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.',
  '[
    {
      "input": "nums = [3,4,5,1,2]",
      "output": "1",
      "explanation": "The original array was [1,2,3,4,5] rotated 3 times"
    }
  ]'::jsonb,
  ARRAY['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000'],
  ARRAY['Array', 'Binary Search'],
  ARRAY['Amazon', 'Microsoft', 'Bloomberg'],
  49.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var findMin = function(nums) {\n    // Your code here\n};"
  }'::jsonb
);

-- =====================================================
-- TWO POINTERS PROBLEMS
-- =====================================================

INSERT INTO public.problems (title, slug, difficulty, category, description, examples, constraints, related_topics, companies, acceptance, is_premium, test_cases, starter_code) VALUES

(
  'Container With Most Water',
  'container-with-most-water',
  'Medium',
  'Two Pointers',
  'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.',
  '[
    {
      "input": "height = [1,8,6,2,5,4,8,3,7]",
      "output": "49",
      "explanation": "The vertical lines are at indices 1 and 8, with heights 8 and 7, width 7"
    }
  ]'::jsonb,
  ARRAY['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
  ARRAY['Array', 'Two Pointers', 'Greedy'],
  ARRAY['Amazon', 'Facebook', 'Google'],
  54.2,
  false,
  '[]'::jsonb,
  '{
    "javascript": "var maxArea = function(height) {\n    // Your code here\n};"
  }'::jsonb
);

-- Update category counts
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Arrays') WHERE name = 'Arrays';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Strings') WHERE name = 'Strings';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Linked Lists') WHERE name = 'Linked Lists';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Trees') WHERE name = 'Trees';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Graphs') WHERE name = 'Graphs';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Dynamic Programming') WHERE name = 'Dynamic Programming';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Greedy') WHERE name = 'Greedy';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Backtracking') WHERE name = 'Backtracking';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Binary Search') WHERE name = 'Binary Search';
UPDATE public.categories SET count = (SELECT COUNT(*) FROM public.problems WHERE category = 'Two Pointers') WHERE name = 'Two Pointers';

COMMIT;
