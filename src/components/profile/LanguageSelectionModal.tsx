import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useTheme();
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: t('language.english') },
    { code: 'hi', name: t('language.hindi') },
  ];

  const handleLanguageSelect = async (langCode: string) => {
    await setLanguage(langCode);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.modalContainer,
          { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.5)' },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {t('language.changeLanguage')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.languageList}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  {
                    backgroundColor:
                      language === lang.code
                        ? isDarkMode
                          ? 'rgba(130, 90, 240, 0.2)'
                          : 'rgba(130, 90, 240, 0.1)'
                        : 'transparent',
                    borderColor: isDarkMode ? '#333333' : '#EEEEEE',
                  },
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text
                  style={[
                    styles.languageName,
                    {
                      color: theme.colors.text,
                      fontWeight: language === lang.code ? 'bold' : 'normal',
                    },
                  ]}
                >
                  {lang.name}
                </Text>
                {language === lang.code && (
                  <Icon name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  languageList: {
    width: '100%',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 16,
  },
});

export default LanguageSelectionModal; 