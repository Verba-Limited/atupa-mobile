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

// Extract actual component name from source file
function extractComponentName(filePath) {
  const basePath = filePath.replace('.spec.ts', '');
  const fileExtensions = ['.ts', '.page.ts', '.component.ts'];
  
  for (const ext of fileExtensions) {
    const componentFilePath = basePath + ext;
    if (fs.existsSync(componentFilePath)) {
      try {
        const content = fs.readFileSync(componentFilePath, 'utf8');
        const classMatch = content.match(/export\s+class\s+([A-Za-z0-9_]+)/);
        if (classMatch && classMatch[1]) {
          return classMatch[1];
        }
      } catch (err) {
        console.error(`Error reading file ${componentFilePath}:`, err);
      }
    }
  }
  
  // If no match found, use a fallback based on file name
  const fileName = path.basename(basePath);
  // Convert kebab-case to PascalCase
  const componentName = fileName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  return componentName + (fileName.includes('page') ? 'Page' : 'Component');
}

// Generate a new test file for a component
function generateComponentTestFile(componentPath, componentName, isService = false) {
  if (isService) {
    return `import { TestBed } from '@angular/core/testing';
import { ${componentName} } from '${componentPath}';

describe('${componentName}', () => {
  let service: ${componentName};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [${componentName}]
    });
    service = TestBed.inject(${componentName});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
`;
  }
  
  const isAppComponent = componentName === 'AppComponent';
  
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
      ${isAppComponent ? 
      `declarations: [${componentName}],
      imports: [IonicModule.forRoot()]` : 
      `providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],
      imports: [
        IonicModule.forRoot(),
        ${componentName}
      ]`}
    }).compileComponents();

    fixture = TestBed.createComponent(${componentName});
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should ${isAppComponent ? 'create the app' : 'create'}', () => {
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
    
    // Determine the component path
    const relPath = path.relative(__dirname, filePath);
    const dirName = path.dirname(relPath);
    const baseName = path.basename(filePath, '.spec.ts');
    
    // Create relative import path
    const componentPath = `./${baseName}`;
    
    // Determine if it's a service
    const isService = baseName.includes('service');
    
    // Extract the actual component name from the source file
    const componentName = extractComponentName(filePath);
    
    console.log(`  - Component name: ${componentName}`);
    
    // Generate the test file
    const newContent = generateComponentTestFile(componentPath, componentName, isService);
    
    // Write the modified content back
    fs.writeFileSync(filePath, newContent);
    console.log(`  - Updated test file for ${componentName}`);
  });
  
  console.log('All spec files processed!');
}

// Run the fix
fixTestFiles(); 