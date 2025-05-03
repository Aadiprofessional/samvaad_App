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
interface ParentUserFormProps {
  onDataChange: (data: {
    childRollNumber?: string;
    relationship?: string;
    purpose?: string;
  }) => void;
}

const ParentUserForm: React.FC<ParentUserFormProps> = ({ onDataChange }) => {
  const { theme } = useTheme();
  
  const [childRollNumber, setChildRollNumber] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [selectedRelation, setSelectedRelation] = useState<string | undefined>(undefined);

  // Relationship options
  const relationshipOptions = [
    'Parent',
    'Guardian',
    'Sibling',
    'Grandparent',
    'Other Family Member',
  ];

  // Purpose options
  const purposeOptions = [
    'Monitor progress',
    'Assist with learning',
    'Learn sign language together',
    'Support communication at home',
    'Other',
  ];

  // Update parent component when form data changes
  React.useEffect(() => {
    onDataChange({
      childRollNumber: childRollNumber || undefined,
      relationship: selectedRelation || relationship || undefined,
      purpose: purpose || undefined,
    });
  }, [childRollNumber, relationship, purpose, selectedRelation, onDataChange]);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Parent/Guardian Information
      </Text>
      
      {/* Child Roll Number Input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="badge-account-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Child's Roll Number (if available)"
          placeholderTextColor={theme.inputPlaceholder}
          value={childRollNumber}
          onChangeText={setChildRollNumber}
        />
      </View>
      
      {/* Relationship Selection */}
      <Text style={[styles.fieldLabel, { color: theme.text }]}>Relationship to Child</Text>
      <View style={styles.optionsContainer}>
        {relationshipOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedRelation === option && { backgroundColor: theme.primary + '20' },
              { borderColor: theme.border }
            ]}
            onPress={() => {
              setSelectedRelation(option);
              if (option !== 'Other Family Member') {
                setRelationship(option);
              } else {
                setRelationship('');
              }
            }}
          >
            <View style={styles.optionRow}>
              <Icon
                name={selectedRelation === option ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                size={20}
                color={selectedRelation === option ? theme.primary : theme.textSecondary}
              />
              <Text style={[
                styles.optionText,
                { color: selectedRelation === option ? theme.primary : theme.text }
              ]}>
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Custom Relationship Input (if "Other Family Member" is selected) */}
      {selectedRelation === 'Other Family Member' && (
        <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
          <Icon name="account-outline" size={20} color={theme.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.inputText }]}
            placeholder="Please specify relationship"
            placeholderTextColor={theme.inputPlaceholder}
            value={relationship}
            onChangeText={setRelationship}
          />
        </View>
      )}
      
      {/* Purpose Selection */}
      <Text style={[styles.fieldLabel, { color: theme.text }]}>Purpose</Text>
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="text-box-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Why are you joining? (e.g., to help my child practice)"
          placeholderTextColor={theme.inputPlaceholder}
          value={purpose}
          onChangeText={setPurpose}
          multiline
        />
      </View>
      
      <Text style={[styles.helperText, { color: theme.textSecondary }]}>
        Note: You can connect with your child later if you don't have their roll number now.
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

export default ParentUserForm; 