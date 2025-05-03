import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';

// Props interface
interface TeacherUserFormProps {
  onDataChange: (data: {
    subjects?: string[];
    teachingPurpose?: string;
  }) => void;
}

const TeacherUserForm: React.FC<TeacherUserFormProps> = ({ onDataChange }) => {
  const { theme } = useTheme();
  
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [otherSubject, setOtherSubject] = useState<string>('');
  const [teachingPurpose, setTeachingPurpose] = useState<string>('');

  // Subject options
  const subjectOptions = [
    'Sign Language',
    'Special Education',
    'Speech Therapy',
    'Inclusive Education',
    'Audiology',
    'Rehabilitation',
    'Other',
  ];

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Get final subjects list including "Other" if selected
  const getFinalSubjects = () => {
    const subjects = [...selectedSubjects];
    if (selectedSubjects.includes('Other') && otherSubject) {
      // Replace 'Other' with the actual subject
      const otherIndex = subjects.indexOf('Other');
      if (otherIndex !== -1) {
        subjects[otherIndex] = otherSubject;
      }
    }
    return subjects;
  };

  // Update parent component when form data changes
  React.useEffect(() => {
    onDataChange({
      subjects: selectedSubjects.length > 0 ? getFinalSubjects() : undefined,
      teachingPurpose: teachingPurpose || undefined,
    });
  }, [selectedSubjects, otherSubject, teachingPurpose, onDataChange]);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Teacher Information
      </Text>
      
      {/* Subjects Selection (Multi-select) */}
      <Text style={[styles.fieldLabel, { color: theme.text }]}>Subjects (Select all that apply)</Text>
      <View style={styles.optionsContainer}>
        {subjectOptions.map(subject => (
          <TouchableOpacity
            key={subject}
            style={[
              styles.optionButton,
              selectedSubjects.includes(subject) && { backgroundColor: theme.primary + '20' },
              { borderColor: theme.border }
            ]}
            onPress={() => toggleSubject(subject)}
          >
            <View style={styles.optionRow}>
              <Icon
                name={selectedSubjects.includes(subject) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={selectedSubjects.includes(subject) ? theme.primary : theme.textSecondary}
              />
              <Text style={[
                styles.optionText,
                { color: selectedSubjects.includes(subject) ? theme.primary : theme.text }
              ]}>
                {subject}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Other Subject Input (if "Other" is selected) */}
      {selectedSubjects.includes('Other') && (
        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
          <Icon name="book-outline" size={20} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.inputText }]}
            placeholder="Please specify other subject"
            placeholderTextColor={theme.inputPlaceholder}
            value={otherSubject}
            onChangeText={setOtherSubject}
          />
        </View>
      )}
      
      {/* Teaching Purpose */}
      <Text style={[styles.fieldLabel, { color: theme.text }]}>Teaching Purpose</Text>
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="text-box-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="What's your purpose for using this platform?"
          placeholderTextColor={theme.inputPlaceholder}
          value={teachingPurpose}
          onChangeText={setTeachingPurpose}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
      
      <Text style={[styles.helperText, { color: theme.textSecondary }]}>
        As a teacher, your role will help enhance the learning experience for our users.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  optionsContainer: {
    marginBottom: 15,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
  },
  helperText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default TeacherUserForm; 