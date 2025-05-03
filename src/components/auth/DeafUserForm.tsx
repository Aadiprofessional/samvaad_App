import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { DeafUserProficiency, DeafUserIssue } from '../../services/authService';

// Props interface
interface DeafUserFormProps {
  onDataChange: (data: {
    age?: number;
    proficiency?: DeafUserProficiency;
    issues?: DeafUserIssue[];
    illnessStage?: string;
  }) => void;
}

const DeafUserForm: React.FC<DeafUserFormProps> = ({ onDataChange }) => {
  const { theme } = useTheme();
  
  const [age, setAge] = useState<string>('');
  const [selectedProficiency, setSelectedProficiency] = useState<DeafUserProficiency | undefined>(undefined);
  const [selectedIssues, setSelectedIssues] = useState<DeafUserIssue[]>([]);
  const [illnessStage, setIllnessStage] = useState<string>('');

  // Proficiency options
  const proficiencyOptions: { label: string; value: DeafUserProficiency }[] = [
    { label: 'Complete Beginner', value: 'complete_beginner' },
    { label: 'Know Basic Hand Signs', value: 'knows_hand_signs' },
    { label: 'Fluent in Hand Signs', value: 'fluent_in_hand_signs' },
    { label: 'Just for Practice', value: 'practice_only' },
  ];

  // Issues options
  const issuesOptions: { label: string; value: DeafUserIssue }[] = [
    { label: 'Congenital (Born with)', value: 'congenital' },
    { label: 'Acquired (Developed later)', value: 'acquired' },
    { label: 'Partial Hearing Loss', value: 'partial' },
    { label: 'Total Hearing Loss', value: 'total' },
  ];

  // Toggle issue selection
  const toggleIssue = (issue: DeafUserIssue) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter(i => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  // Update parent component when form data changes
  React.useEffect(() => {
    onDataChange({
      age: age ? parseInt(age, 10) : undefined,
      proficiency: selectedProficiency,
      issues: selectedIssues.length > 0 ? selectedIssues : undefined,
      illnessStage: illnessStage || undefined,
    });
  }, [age, selectedProficiency, selectedIssues, illnessStage, onDataChange]);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Deaf User Information
      </Text>
      
      {/* Age Input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="calendar-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Age"
          placeholderTextColor={theme.inputPlaceholder}
          value={age}
          onChangeText={setAge}
          keyboardType="number-pad"
        />
      </View>
      
      {/* Proficiency Selection */}
      <Text style={[styles.fieldLabel, { color: theme.text }]}>Sign Language Proficiency</Text>
      <View style={styles.optionsContainer}>
        {proficiencyOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedProficiency === option.value && { backgroundColor: theme.primary + '20' },
              { borderColor: theme.border }
            ]}
            onPress={() => setSelectedProficiency(option.value)}
          >
            <View style={styles.optionRow}>
              <Icon
                name={selectedProficiency === option.value ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                size={20}
                color={selectedProficiency === option.value ? theme.primary : theme.textSecondary}
              />
              <Text style={[
                styles.optionText,
                { color: selectedProficiency === option.value ? theme.primary : theme.text }
              ]}>
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Issues Selection (Multi-select) */}
      <Text style={[styles.fieldLabel, { color: theme.text }]}>Hearing Issues (Select all that apply)</Text>
      <View style={styles.optionsContainer}>
        {issuesOptions.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedIssues.includes(option.value) && { backgroundColor: theme.primary + '20' },
              { borderColor: theme.border }
            ]}
            onPress={() => toggleIssue(option.value)}
          >
            <View style={styles.optionRow}>
              <Icon
                name={selectedIssues.includes(option.value) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={selectedIssues.includes(option.value) ? theme.primary : theme.textSecondary}
              />
              <Text style={[
                styles.optionText,
                { color: selectedIssues.includes(option.value) ? theme.primary : theme.text }
              ]}>
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Illness Stage Input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="information-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Illness Stage or Additional Details"
          placeholderTextColor={theme.inputPlaceholder}
          value={illnessStage}
          onChangeText={setIllnessStage}
        />
      </View>
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
});

export default DeafUserForm; 