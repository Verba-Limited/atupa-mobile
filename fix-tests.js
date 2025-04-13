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

// Fix standalone component declarations issue
function fixStandaloneComponentIssue(content) {
  // Check if there's a component declared in declarations but is standalone
  if (content.includes('declarations: [') && !content.includes('providers: [')) {
    // Extract the component name from the declarations array
    const match = content.match(/declarations:\s*\[\s*([A-Za-z0-9_]+)\s*\]/);
    if (match && match[1]) {
      const componentName = match[1];
      
      // Replace declarations with imports for the component
      return content.replace(
        /declarations:\s*\[\s*([A-Za-z0-9_]+)\s*\](,)?\s*imports:\s*\[([\s\S]*?)\]/,
        `imports: [$3,\n        ${componentName}]`
      ).replace(
        /declarations:\s*\[\s*([A-Za-z0-9_]+)\s*\](,)?/,
        `imports: [$1]$2`
      );
    }
  }
  
  // Check for app component with missing NgModule
  if (content.includes('AppComponent') || content.includes('HomePage')) {
    content = content.replace(
      /TestBed\.configureTestingModule\(\{([^}]*)\}\)/,
      (match, inner) => {
        // If declarations is already defined, don't add it
        if (inner.includes('declarations:')) {
          return match;
        }
        
        // Add declarations for the component
        const componentName = content.includes('AppComponent') ? 'AppComponent' : 'HomePage';
        return `TestBed.configureTestingModule({${inner}declarations: [${componentName}]})`;
      }
    );
  }
  
  return content;
}

// Fix missing provider issues for AngularDelegate/ModalController
function fixMissingProviderIssue(content) {
  // Check if the test potentially has Ionic components that need providers
  if (content.includes('ModalController') || 
      content.includes('Ionic') ||
      content.includes('Page')) {
    
    // Add imports if they don't exist
    if (!content.includes('import { MockProvider }')) {
      content = content.replace(
        /import.*?from.*?;(\r?\n)/,
        `$&import { MockProvider } from 'ng-mocks';$1`
      );
    }
    
    if (!content.includes('import { ModalController }')) {
      content = content.replace(
        /import.*?from.*?;(\r?\n)/,
        `$&import { ModalController, AngularDelegate } from '@ionic/angular';$1`
      );
    } else if (!content.includes('AngularDelegate')) {
      // Add AngularDelegate if ModalController is already imported
      content = content.replace(
        /import \{([^}]*?)ModalController([^}]*?)\} from '@ionic\/angular';/,
        `import {$1ModalController$2, AngularDelegate } from '@ionic/angular';`
      );
    }
    
    // Always add ActivatedRoute import
    if (!content.includes('import { ActivatedRoute }')) {
      content = content.replace(
        /import.*?from.*?;(\r?\n)/,
        `$&import { ActivatedRoute } from '@angular/router';$1`
      );
    }
    
    // Fix any paramMap mocks by removing them
    content = content.replace(
      /MockProvider\(ActivatedRoute,\s*\{[\s\S]*?\}\)/g,
      'MockProvider(ActivatedRoute)'
    );
    
    // Add TestBed configuration with providers if needed
    if (!content.includes('TestBed.configureTestingModule')) {
      content = content.replace(
        /beforeEach\(\(\) => \{/,
        `beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ]
    });`
      );
    } else if (!content.includes('providers:')) {
      content = content.replace(
        /TestBed\.configureTestingModule\(\{/,
        `TestBed.configureTestingModule({
      providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate)
      ],`
      );
    } else if (!content.includes('MockProvider(ModalController)')) {
      content = content.replace(
        /providers:\s*\[/,
        `providers: [
        MockProvider(ModalController),
        MockProvider(ActivatedRoute),
        MockProvider(AngularDelegate),`
      );
    } else if (!content.includes('MockProvider(AngularDelegate)')) {
      content = content.replace(
        /providers:\s*\[([\s\S]*?)MockProvider\(ModalController\)([\s\S]*?)\]/,
        `providers: [$1MockProvider(ModalController)$2,
        MockProvider(AngularDelegate)]`
      );
    }
  }
  
  return content;
}

// Main function to process all spec files
function fixTestFiles() {
  const specFiles = findSpecFiles(path.join(__dirname, 'src'));
  
  console.log(`Found ${specFiles.length} spec files to process`);
  
  specFiles.forEach(filePath => {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply fixes
    content = fixStandaloneComponentIssue(content);
    content = fixMissingProviderIssue(content);
    
    // Write the modified content back
    fs.writeFileSync(filePath, content);
  });
  
  console.log('All spec files processed!');
}

// Run the fix
fixTestFiles(); 