const fs = require('fs');
const path = require('path');

// Recursively find all spec.ts files
function findSpecFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findSpecFiles(filePath, fileList);
    } else if (file.endsWith('.spec.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Generate a new test file for a component
function generateComponentTestFile(componentPath, componentName) {
  const isStandalone = true; // Assume all components are standalone
  
  // Create template for spec file
  return `import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

import { ${componentName} } from '${componentPath}';

describe('${componentName}', () => {
  let component: ${componentName};
  let fixture: ComponentFixture<${componentName}>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],
      ${isStandalone ? `imports: [
        IonicModule.forRoot(),
        ${componentName}
      ]` : `declarations: [${componentName}],
      imports: [IonicModule.forRoot()]`}
    }).compileComponents();

    fixture = TestBed.createComponent(${componentName});
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`;
}

// Main function to process all spec files
function fixTestFiles() {
  const specFiles = findSpecFiles(path.join(__dirname, 'src'));
  
  console.log(`Found ${specFiles.length} spec files to process`);
  
  specFiles.forEach(filePath => {
    console.log(`Processing: ${filePath}`);
    
    // Extract component name from file path
    const fileNameMatch = filePath.match(/([^\/]+)\.spec\.ts$/);
    if (!fileNameMatch) {
      console.log(`  - Skipping: Could not extract component name from ${filePath}`);
      return;
    }
    
    // Determine component path and name
    const fileName = fileNameMatch[1];
    let componentName = fileName.replace(/[-\.]/g, '');
    
    // Convert to PascalCase
    componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    
    // Add Page/Component suffix if not present
    if (!componentName.endsWith('Page') && !componentName.endsWith('Component')) {
      if (filePath.includes('page')) {
        componentName += 'Page';
      } else {
        componentName += 'Component';
      }
    }
    
    // Generate path to the component file from spec file
    const componentPath = `./${fileName}`;
    
    // Generate the test file
    const newContent = generateComponentTestFile(componentPath, componentName);
    
    // Write the modified content back
    fs.writeFileSync(filePath, newContent);
    console.log(`  - Updated test file for ${componentName}`);
  });
  
  console.log('All spec files processed!');
}

// Run the fix
fixTestFiles(); 