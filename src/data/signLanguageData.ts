/**
 * Sign language reference data
 * Contains information about different sign language gestures
 */

export interface SignLanguageGesture {
  id: string;
  name: string;
  description: string;
  gesture: string;
  imageSource?: any;
}

export interface SignLanguageAlphabet {
  letter: string;
  gesture: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ASL Alphabet data
export const ASL_ALPHABET: SignLanguageAlphabet[] = [
  {
    letter: 'A',
    gesture: 'a_letter',
    description: 'Make a fist with your hand, with your thumb resting on the side of your index finger.',
    difficulty: 'easy',
  },
  {
    letter: 'B',
    gesture: 'b_letter',
    description: 'Hold your hand flat, with fingers together and thumb tucked across the palm.',
    difficulty: 'easy',
  },
  {
    letter: 'C',
    gesture: 'c_letter',
    description: 'Curve your hand into a "C" shape with your thumb and fingers.',
    difficulty: 'easy',
  },
  {
    letter: 'D',
    gesture: 'd_letter',
    description: 'Make a circle with your thumb and index finger, keeping other fingers straight up.',
    difficulty: 'medium',
  },
  {
    letter: 'E',
    gesture: 'e_letter',
    description: 'Curl your fingers in toward your palm, with your thumb tucked under your fingers.',
    difficulty: 'medium',
  },
  {
    letter: 'F',
    gesture: 'f_letter',
    description: 'Connect your thumb and index finger in a circle, with the other fingers straight up.',
    difficulty: 'medium',
  },
  {
    letter: 'G',
    gesture: 'g_letter',
    description: 'Make a fist with your index finger pointing straight out and your thumb extended.',
    difficulty: 'medium',
  },
  {
    letter: 'H',
    gesture: 'h_letter',
    description: 'Extend your index and middle fingers together, with your thumb against your fingers.',
    difficulty: 'medium',
  },
  {
    letter: 'I',
    gesture: 'i_letter',
    description: 'Make a fist with your pinkie finger extended upward.',
    difficulty: 'easy',
  },
  {
    letter: 'J',
    gesture: 'j_letter',
    description: 'Start with the sign for "I", then trace a "J" shape in the air with your pinkie.',
    difficulty: 'hard',
  },
  {
    letter: 'K',
    gesture: 'k_letter',
    description: 'Extend your index and middle fingers upward with your thumb between them.',
    difficulty: 'medium',
  },
  {
    letter: 'L',
    gesture: 'l_letter',
    description: 'Form an "L" shape with your thumb and index finger, with other fingers curled in.',
    difficulty: 'easy',
  },
  {
    letter: 'M',
    gesture: 'm_letter',
    description: 'Place your thumb between your ring and pinkie fingers, with your hand facing down.',
    difficulty: 'hard',
  },
  {
    letter: 'N',
    gesture: 'n_letter',
    description: 'Place your thumb between your middle and ring fingers, with your hand facing down.',
    difficulty: 'hard',
  },
  {
    letter: 'O',
    gesture: 'o_letter',
    description: 'Form a circle with all fingertips and thumb touching.',
    difficulty: 'easy',
  },
  {
    letter: 'P',
    gesture: 'p_letter',
    description: 'Point your middle finger down with your index finger and thumb extended.',
    difficulty: 'hard',
  },
  {
    letter: 'Q',
    gesture: 'q_letter',
    description: 'Point your index finger down with your thumb extended to the side.',
    difficulty: 'hard',
  },
  {
    letter: 'R',
    gesture: 'r_letter',
    description: 'Cross your middle finger over your index finger, with both extended upward.',
    difficulty: 'medium',
  },
  {
    letter: 'S',
    gesture: 's_letter',
    description: 'Make a fist with your thumb wrapped over your fingers.',
    difficulty: 'easy',
  },
  {
    letter: 'T',
    gesture: 't_letter',
    description: 'Make a fist with your thumb between your index and middle fingers.',
    difficulty: 'medium',
  },
  {
    letter: 'U',
    gesture: 'u_letter',
    description: 'Extend your index and middle fingers together upward, like a "peace" sign.',
    difficulty: 'easy',
  },
  {
    letter: 'V',
    gesture: 'v_letter',
    description: 'Extend your index and middle fingers in a "V" shape, with other fingers curled in.',
    difficulty: 'easy',
  },
  {
    letter: 'W',
    gesture: 'w_letter',
    description: 'Extend your index, middle, and ring fingers, forming a "W" shape.',
    difficulty: 'easy',
  },
  {
    letter: 'X',
    gesture: 'x_letter',
    description: 'Make a fist with your index finger half-bent like a hook.',
    difficulty: 'medium',
  },
  {
    letter: 'Y',
    gesture: 'y_letter',
    description: 'Extend your thumb and pinkie finger, keeping other fingers curled in.',
    difficulty: 'easy',
  },
  {
    letter: 'Z',
    gesture: 'z_letter',
    description: 'Make the letter "Z" in the air with your index finger.',
    difficulty: 'hard',
  }
];

// Main sign language gestures that our app can detect
export const DETECTABLE_SIGNS: SignLanguageGesture[] = [
  {
    id: 'thumbs_up',
    name: 'Yes / Good',
    description: 'Indicates agreement, approval, or confirmation',
    gesture: 'thumbs_up',
  },
  {
    id: 'open_palm',
    name: 'Hello',
    description: 'Used as a greeting or to get attention',
    gesture: 'open_palm',
  },
  {
    id: 'victory',
    name: 'Peace / Number 2',
    description: 'Shows the number 2 or represents peace',
    gesture: 'victory',
  },
  
  {
    id: 'fist',
    name: 'No / Stop',
    description: 'Expresses negation or tells someone to stop',
    gesture: 'fist',
  },
  {
    id: 'i_love_you',
    name: 'I Love You',
    description: 'Expresses love and affection',
    gesture: 'i_love_you',
  },
  // Add alphabet letters to detectable signs
  ...ASL_ALPHABET.map(letter => ({
    id: letter.gesture,
    name: `Letter ${letter.letter}`,
    description: letter.description,
    gesture: letter.gesture,
  }))
];

// Common everyday phrases in sign language
export const COMMON_PHRASES: SignLanguageGesture[] = [
  {
    id: 'thank_you',
    name: 'Thank You',
    description: 'Express gratitude',
    gesture: 'thank_you',
    imageSource: require('../assets/images/placeholder-avatar.png'), // Placeholder
  },
  {
    id: 'please',
    name: 'Please',
    description: 'Make a polite request',
    gesture: 'please',
    imageSource: require('../assets/images/placeholder-avatar.png'), // Placeholder
  },
  {
    id: 'sorry',
    name: 'Sorry',
    description: 'Express an apology',
    gesture: 'sorry',
    imageSource: require('../assets/images/placeholder-avatar.png'), // Placeholder
  },
  {
    id: 'help',
    name: 'Help',
    description: 'Ask for assistance',
    gesture: 'help',
    imageSource: require('../assets/images/placeholder-avatar.png'), // Placeholder
  },
];

// Map for translating detected gestures to text
export const SIGN_LANGUAGE_TRANSLATION_MAP: Record<string, string> = {
  'thumbs_up': 'Yes',
  'open_palm': 'Hello',
  'victory': 'Peace',
  'pointing_up': 'I want',
  'fist': 'No',
  'thumbs_down': 'Disagree',
  'ok_sign': 'OK',
  'i_love_you': 'I love you',
  'wave': 'Hello',
  'call_me': 'Call me',
};

export default {
  DETECTABLE_SIGNS,
  ASL_ALPHABET,
  COMMON_PHRASES,
  SIGN_LANGUAGE_TRANSLATION_MAP,
}; 