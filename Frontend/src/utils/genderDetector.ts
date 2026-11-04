// Comprehensive Gender Inference Engine for Indian / Telugu Student Names
// Calibrated specifically for Narayana Engineering College, Nellore (NECN) students

const femaleExplicitTokens = new Set([
  'risheetha', 'bhavana', 'tejaswini', 'kaveri', 'rajeswari', 'sunandini', 'siri', 'shanushka',
  'sahithya', 'sruthi', 'harika', 'vishnupriya', 'devanandini', 'nikhila', 'mounika', 'deepika',
  'anusha', 'sneha', 'swetha', 'ramya', 'divya', 'sireesha', 'sirisha', 'sushma', 'kavya', 'lavanya',
  'sandhya', 'sravya', 'geetha', 'pranitha', 'anitha', 'vineetha', 'amrutha', 'likitha', 'harshitha',
  'sujitha', 'madhuri', 'lahari', 'jahnavi', 'kalyani', 'gayathri', 'pallavi', 'tejaswi', 'navyasri',
  'bindu', 'chandana', 'manasa', 'meghana', 'poojitha', 'pujitha', 'roopa', 'vennela', 'yamini',
  'aasritha', 'aakanksha', 'akshaya', 'akhila', 'aparna', 'archana', 'ashritha', 'bhavya', 'charitha',
  'chinmayi', 'deepthi', 'dharani', 'ganga', 'gowri', 'hima', 'indu', 'ishwarya', 'jyothi', 'kanchana',
  'kusuma', 'madhavi', 'malathi', 'meenakshi', 'nagalakshmi', 'nandini', 'pavithra', 'prathyusha',
  'radhika', 'rekha', 'renuka', 'rohini', 'sahithi', 'sailaja', 'samyuktha', 'sarada', 'saritha',
  'sasikala', 'soundarya', 'sowmya', 'spandana', 'sravani', 'sreeja', 'sreevidya', 'srilekha',
  'subhashini', 'sudha', 'suhasini', 'sukanya', 'sunitha', 'supriya', 'surekha', 'thriveni', 'uma',
  'usha', 'vani', 'varsha', 'vasantha', 'vasundhara', 'vijaya', 'vimala', 'yamuna', 'nandhini',
  'kavitha', 'hema', 'shravani', 'preethi', 'priti', 'pooja', 'neha', 'tanuja', 'keerthana',
  'keerthi', 'chandrika', 'ananya', 'alekhya', 'ruchitha', 'dhanalakshmi', 'padmavathi', 'jaya',
  'pranathi', 'chaitra', 'supraja', 'hasini', 'monica', 'aishwarya', 'krishnaveni', 'leela',
  'tulasi', 'manogna', 'sindhu', 'harshini', 'priya', 'priyanka', 'lakshmi', 'laxmi', 'devi',
  'kumari', 'sree', 'shree', 'sri', 'amulya', 'bhargavi', 'charshitha', 'lokitha', 'tejitha',
  'janeela', 'sukrithi', 'himaja', 'pranita', 'swathi', 'sharon', 'reshma', 'farzana', 'aswini',
  'ashwini', 'madhura', 'madhurima', 'meghana', 'saranya', 'sirichandana', 'sravanthi'
]);

const maleExplicitTokens = new Set([
  'mohith', 'kousic', 'koushik', 'kaushik', 'himanish', 'pareesh', 'pream', 'prem', 'varshith', 'sushank',
  'charan', 'dinesh', 'kalyan', 'rajesh', 'karthik', 'pavan', 'pawan', 'venkata', 'kumar', 'sameer', 'basha',
  'shaik', 'sai', 'teja', 'praneeth', 'rohith', 'bharath', 'sujith', 'vinith', 'puneeth', 'jaswanth',
  'hemanth', 'rakesh', 'suresh', 'mahesh', 'venkatesh', 'lokesh', 'tarun', 'tharun', 'varun', 'kiran',
  'madan', 'akhil', 'ajay', 'anil', 'arun', 'bhanu', 'chaitanya', 'chandu', 'deepak', 'gopi', 'hari',
  'harsha', 'jagadeesh', 'jagadish', 'kishore', 'krishna', 'madhu', 'manoj', 'murali', 'nagaraju',
  'naresh', 'naveen', 'nikhil', 'nithin', 'pradeep', 'prakash', 'prashanth', 'raghu', 'rahul', 'raja',
  'ram', 'ramesh', 'ravi', 'sandeep', 'santosh', 'sathish', 'sekhar', 'shiva', 'siva', 'srinivas',
  'subrahmanyam', 'sudheer', 'sunil', 'surya', 'uday', 'vamsi', 'vamsy', 'venu', 'vijay', 'vikas',
  'vinay', 'vineeth', 'vishnu', 'vivekananda', 'yashwanth', 'yeshwanth', 'abhishek', 'adarsh', 'aditya',
  'adithya', 'akash', 'avash', 'ayush', 'dhanush', 'dilip', 'girish', 'gnaneswar', 'guru', 'harish',
  'harshit', 'hithesh', 'kallol', 'kamal', 'madhav', 'manikanta', 'manish', 'mithun', 'muneeb',
  'munir', 'naga', 'narendra', 'omkar', 'pranav', 'prashant', 'praveen', 'prithviraj', 'prajesh',
  'nagesh', 'raj', 'ritesh', 'rohan', 'sagar', 'saikumar', 'saiteja', 'samrat', 'sanjay', 'sarath',
  'sashi', 'sathvik', 'satish', 'shankar', 'shashank', 'shashi', 'shyam', 'siddharth', 'somasekhar',
  'soundar', 'subhash', 'sujan', 'sumanth', 'tanuj', 'tejas', 'udaykiran', 'vignesh', 'vikram',
  'virendra', 'vishal', 'viswanath', 'yuvraj', 'srikanth', 'shashidhar', 'ravindra', 'gireesh'
]);

export function inferStudentGender(fullName: string): 'female' | 'male' {
  if (!fullName) return 'female';
  const clean = fullName.toLowerCase().replace(/[^a-z\s]/g, ' ').trim();
  const tokens = clean.split(/\s+/).filter(Boolean);

  // 1. Explicit female check
  for (const t of tokens) {
    if (femaleExplicitTokens.has(t)) return 'female';
  }

  // 2. Female specific compound suffixes
  for (const t of tokens) {
    if (
      t.endsWith('priya') || t.endsWith('lakshmi') || t.endsWith('kumari') || t.endsWith('devi') ||
      t.endsWith('sree') || t.endsWith('shree') || t.endsWith('nandini') || t.endsWith('shitha') ||
      t.endsWith('vathi') || t.endsWith('swari') || t.endsWith('mitha') || t.endsWith('ritha') ||
      t.endsWith('jitha') || t.endsWith('rutha') || t.endsWith('thya') || t.endsWith('yothi') ||
      t.endsWith('asri') || t.endsWith('asree') || t.endsWith('pujitha') || t.endsWith('poojitha') ||
      t.endsWith('vani') || t.endsWith('wini') || t.endsWith('thana') || t.endsWith('itha')
    ) {
      return 'female';
    }
  }

  // 3. Explicit male check
  for (const t of tokens) {
    if (maleExplicitTokens.has(t)) return 'male';
  }

  // 4. Male specific compound suffixes
  for (const t of tokens) {
    if (
      t.endsWith('kumar') || t.endsWith('reddy') || t.endsWith('raju') || t.endsWith('babu') ||
      t.endsWith('prasad') || t.endsWith('vamsi') || t.endsWith('teja') || t.endsWith('shankar') ||
      t.endsWith('karthik') || t.endsWith('swamy') || t.endsWith('naidu') || t.endsWith('esh') ||
      t.endsWith('ith') || t.endsWith('eeth') || t.endsWith('anth') || t.endsWith('shanth') ||
      t.endsWith('raj') || t.endsWith('deep') || t.endsWith('eshwar') || t.endsWith('swar') ||
      t.endsWith('kiran') || t.endsWith('varun') || t.endsWith('tarun') || t.endsWith('tharun')
    ) {
      return 'male';
    }
  }

  // 5. Check last word (frequent in GivenName placement)
  const last = tokens[tokens.length - 1] || '';
  if (last.endsWith('a') || last.endsWith('i') || last.endsWith('ee')) {
    const maleExceptions = new Set([
      'krishna', 'rama', 'chaitanya', 'shiva', 'siva', 'bhanu', 'surya', 'raghu', 'sai',
      'vamsi', 'kanna', 'subba', 'naga', 'somanna', 'manga', 'linga', 'gangaiah', 'appanna'
    ]);
    if (!maleExceptions.has(last)) {
      return 'female';
    }
  }

  return 'male';
}

