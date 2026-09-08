import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme, Card } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDocumentViewer } from '@app/core';
import {
  CustomHeader,
  CustomCard,
  CustomProgressBar,
  CustomChip,
  CustomSwitch,
  CustomListItem,
  CustomBottomSheet,
  CustomButton,
  CustomFilePicker,
  CustomDropdown,
  CustomDownloadButton,
  Row,
  Col,
  fontFamilies,
} from '@app/ui';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

const CHIP_STATUSES = ['All', 'Active', 'Pending', 'Archived'] as const;

const PRIORITY_ITEMS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const CATEGORY_ITEMS = [
  { label: 'Bug Report', value: 'bug' },
  { label: 'Feature Request', value: 'feature' },
  { label: 'Documentation', value: 'docs' },
  { label: 'Performance', value: 'perf' },
];

export const DashboardScreen = observer(() => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const [selectedChip, setSelectedChip] = useState('All');
  const [switchValue, setSwitchValue] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pickedFile, setPickedFile] = useState<{ uri: string; name: string } | null>(null);
  const { view: viewDoc, isDownloading, progress, error: viewerError } = useDocumentViewer();

  const handleOpenDrawer = useCallback(() => navigation.openDrawer(), [navigation]);
  const handleSwitchChange = useCallback((val: boolean) => setSwitchValue(val), []);
  const handleOpenSheet = useCallback(() => setShowBottomSheet(true), []);
  const handleCloseSheet = useCallback(() => setShowBottomSheet(false), []);
  const handlePriorityChange = useCallback((val: string) => setSelectedPriority(val), []);
  const handleCategoryChange = useCallback((val: string) => setSelectedCategory(val), []);

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background],
  );

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={containerStyle}>
      <CustomHeader
        title={t('dashboard.title')}
        onMenuPress={handleOpenDrawer}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          variant="headlineSmall"
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {t('dashboard.stats')}
        </Text>

        <CustomCard
          title="App Overview"
          subtitle="Real-time system configurations"
          content="This view demonstrates complex reusable elements working in harmony under MD3 style guidelines."
          style={styles.card}
        >
          <View style={styles.cardStats}>
            <CustomProgressBar
              progress={0.75}
              label={t('dashboard.dataUsage')}
            />
          </View>
        </CustomCard>

        <Text
          variant="titleLarge"
          style={[styles.subtitle, { color: theme.colors.onSurface }]}
        >
          {t('dashboard.interactiveDemo')}
        </Text>

        {/* Custom Chips Demo */}
        <View style={styles.row}>
          {CHIP_STATUSES.map(status => (
            <CustomChip
              key={status}
              selected={selectedChip === status}
              onPress={() => setSelectedChip(status)}
            >
              {status}
            </CustomChip>
          ))}
        </View>

        {/* Custom Switch Demo */}
        <CustomSwitch
          label="Push Notifications Status"
          value={switchValue}
          onValueChange={handleSwitchChange}
          style={styles.switchRow}
        />

        {/* Grid System Demonstration */}
        <Text
          variant="titleMedium"
          style={[styles.subtitle, { marginTop: 16 }]}
        >
          Grid System (Row & Col Demo)
        </Text>
        <Row gap={12} style={{ marginBottom: 8 }}>
          <Col>
            <Card style={{ padding: 12 }}>
              <Text variant="labelMedium">Col 1 (flex:1)</Text>
              <Text
                variant="titleMedium"
                style={{ fontFamily: fontFamilies.bold, marginTop: 4 }}
              >
                Left Block
              </Text>
            </Card>
          </Col>
          <Col>
            <Card style={{ padding: 12 }}>
              <Text variant="labelMedium">Col 2 (flex:1)</Text>
              <Text
                variant="titleMedium"
                style={{ fontFamily: fontFamilies.bold, marginTop: 4 }}
              >
                Right Block
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Custom ListItems Demo */}
        <View style={styles.listWrapper}>
          <CustomListItem
            title={t('dashboard.totalUsers')}
            description="1,248 registered members"
            leftIcon="account-multiple"
            rightType="badge"
            badgeValue="+15"
          />
          <CustomListItem
            title={t('dashboard.activeSessions')}
            description="342 online currently"
            leftIcon="lan-connect"
            rightType="arrow"
            onPress={() => console.log('Item pressed')}
          />
        </View>

        {/* Custom Dropdown Demo */}
        <Text
          variant="titleMedium"
          style={[styles.subtitle, { marginTop: 16 }]}
        >
          Dropdown Select
        </Text>
        <CustomDropdown
          label="Priority"
          value={selectedPriority}
          onValueChange={handlePriorityChange}
          placeholder="Select priority"
          items={PRIORITY_ITEMS}
        />
        <CustomDropdown
          label="Category"
          value={selectedCategory}
          onValueChange={handleCategoryChange}
          placeholder="Select category"
          items={CATEGORY_ITEMS}
        />

        {/* Custom File Picker & Document Viewer Demo */}
        <Text
          variant="titleMedium"
          style={[styles.subtitle, { marginTop: 16 }]}
        >
          Document Viewer & Upload Demonstration
        </Text>
        
        {/* Progress indicator during remote viewing download */}
        {isDownloading && (
          <View style={{ marginVertical: 8 }}>
            <Text variant="bodySmall">Downloading document... {Math.round(progress * 100)}%</Text>
            <CustomProgressBar progress={progress} style={{ marginTop: 4 }} />
          </View>
        )}

        {viewerError && (
          <Text style={{ color: theme.colors.error, marginVertical: 8 }}>
            Error opening document: {viewerError}
          </Text>
        )}

        <CustomFilePicker
          label="Pick a PDF or Image to Preview"
          onFilePicked={(files) => {
            console.log('Picked files:', files);
            if (files.length > 0) {
              setPickedFile({ uri: files[0].uri, name: files[0].name });
            } else {
              setPickedFile(null);
            }
          }}
          allowedTypes={['application/pdf', 'image/*']}
        />

        {/* List of files to demonstrate programmatic viewing */}
        <Card style={[styles.card, { marginVertical: 8 }]} mode="contained">
          <Card.Title title="Available Documents (Click item to preview)" titleStyle={{ fontFamily: fontFamilies.semibold, fontSize: 14 }} />
          <Card.Content>
            {/* Clickable Remote File */}
            <CustomListItem
              title="Remote Sample Document"
              description="Click to download and preview sample.pdf"
              leftIcon="file-pdf-box"
              rightType="arrow"
              onPress={() => {
                viewDoc({
                  uri: 'https://www.africau.edu/images/default/sample.pdf',
                  filename: 'sample.pdf',
                  title: 'Remote Sample PDF',
                }).catch((err) => console.warn(err));
              }}
            />

            {/* Clickable Locally Picked File (if any) */}
            {pickedFile && (
              <CustomListItem
                title={`Picked File: ${pickedFile.name}`}
                description="Click to preview the selected local file"
                leftIcon="file-image-outline"
                rightType="arrow"
                onPress={() => {
                  viewDoc({
                    uri: pickedFile.uri,
                    filename: pickedFile.name,
                    title: pickedFile.name,
                  }).catch((err) => console.warn(err));
                }}
              />
            )}
          </Card.Content>
        </Card>

        {/* Download Demo */}
        <Text
          variant="titleMedium"
          style={[styles.subtitle, { marginTop: 16 }]}
        >
          File Download
        </Text>
        {/* Replace the URL with your actual download endpoint */}
        <CustomDownloadButton
          url="https://www.africau.edu/images/default/sample.pdf"
          filename="sample.pdf"
          label="Download Sample PDF"
          destination="documents"
          onSuccess={(path: string) => console.log('Saved to:', path)}
          onError={(err: string) => console.warn('Download error:', err)}
          style={styles.downloadBtn}
        />

        {/* Bottom Sheet Demo Trigger */}
        <CustomButton
          mode="outlined"
          onPress={handleOpenSheet}
          icon="unfold-more-horizontal"
          style={styles.sheetBtn}
        >
          Open Bottom Sheet
        </CustomButton>

        {/* Custom Bottom Sheet */}
        <CustomBottomSheet
          visible={showBottomSheet}
          onClose={handleCloseSheet}
        >
          <View style={styles.sheetContent}>
            <Text
              variant="titleLarge"
              style={[styles.sheetTitle, { color: theme.colors.onSurface }]}
            >
              Bottom Sheet Custom Content
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sheetDesc, { color: theme.colors.onSurfaceVariant }]}
            >
              This slide-up container is implemented using standard modal
              overlays, preserving system memory. You can place any list or form
              inside it!
            </Text>
            <CustomButton mode="contained" onPress={handleCloseSheet}>
              Close Sheet
            </CustomButton>
          </View>
        </CustomBottomSheet>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: fontFamilies.bold,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: fontFamilies.semibold,
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    marginBottom: 8,
  },
  cardStats: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  switchRow: {
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginVertical: 8,
  },
  listWrapper: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  downloadBtn: {
    marginBottom: 4,
  },
  sheetBtn: {
    marginTop: 16,
  },
  sheetContent: {
    paddingVertical: 10,
  },
  sheetTitle: {
    fontFamily: fontFamilies.bold,
    marginBottom: 10,
  },
  sheetDesc: {
    fontFamily: fontFamilies.regular,
    marginBottom: 20,
    lineHeight: 20,
  },
});

export default DashboardScreen;
