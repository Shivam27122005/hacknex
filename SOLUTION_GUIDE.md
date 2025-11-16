# How to Successfully Solve Coding Problems

## Understanding the Process

1. **Read the problem carefully** - Understand what's being asked
2. **Identify inputs and outputs** - Know what you're working with
3. **Think of edge cases** - Consider empty inputs, extreme values
4. **Plan your approach** - Think before coding
5. **Write clean, working code** - Focus on correctness first
6. **Test with examples** - Run through provided test cases
7. **Submit when all tests pass** - Only submit when confident

## Two Sum Problem Solution

### Problem Statement
Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

### Example
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

### Correct Solution (JavaScript)

```javascript
var twoSum = function(nums, target) {
    // Create a map to store value -> index mappings
    const numMap = new Map();
    
    // Iterate through the array
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists in our map
        if (numMap.has(complement)) {
            // Return the indices
            return [numMap.get(complement), i];
        }
        
        // Store current number and its index
        numMap.set(nums[i], i);
    }
    
    // This line should never be reached given the problem constraints
    return [];
};
```

### How It Works

1. **Hash Map Approach** (Most Efficient):
   - Time Complexity: O(n)
   - Space Complexity: O(n)
   - We store each number and its index in a map
   - For each number, we calculate what its complement should be (target - current number)
   - If the complement exists in our map, we've found our answer
   - Otherwise, we store the current number and continue

2. **Step-by-step with example** `nums = [2,7,11,15], target = 9`:
   - i=0: num=2, complement=7. 7 not in map. Store 2->0.
   - i=1: num=7, complement=2. 2 IS in map at index 0. Return [0,1].

### Common Mistakes to Avoid

1. **Using nested loops** (O(n²) time complexity):
   ```javascript
   // DON'T do this - inefficient
   var twoSum = function(nums, target) {
       for (let i = 0; i < nums.length; i++) {
           for (let j = i + 1; j < nums.length; j++) {
               if (nums[i] + nums[j] === target) {
                   return [i, j];
               }
           }
       }
   };
   ```

2. **Not handling the "same element" constraint**:
   - Make sure you're not using the same index twice

3. **Returning wrong format**:
   - Always return an array with exactly two indices
   - Make sure the indices are in the correct order

### How to Test Your Solution

1. **Run the "Run Code" button first** - This tests with example cases
2. **Check all test case results** - Make sure all show ✅
3. **Look at execution time** - Aim for efficient solutions
4. **Only click "Submit" when all tests pass**

### Tips for Success

1. **Start with the examples** - Make sure your code works for provided examples
2. **Think about edge cases**:
   - Empty arrays
   - Arrays with two elements
   - Negative numbers
   - Large numbers
3. **Use the right data structures**:
   - Hash maps for O(1) lookups
   - Two pointers for sorted arrays
4. **Keep it simple** - Don't overcomplicate
5. **Read error messages** - They often tell you exactly what's wrong

## General Problem-Solving Strategy

1. **Understand the constraints** - What are the limits?
2. **Identify the approach** - Brute force, greedy, dynamic programming, etc.
3. **Write pseudocode first** - Plan before coding
4. **Implement step by step** - Don't try to write everything at once
5. **Test as you go** - Run small tests frequently
6. **Optimize if needed** - Improve time/space complexity

Remember: Practice makes perfect. The more problems you solve, the better you'll get!