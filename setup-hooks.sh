#!/bin/bash

echo "🔧 Setting up Git hooks for pre-commit checks..."

# Git hooks 디렉토리 생성
mkdir -p .git/hooks

# pre-commit hook 생성
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# 스테이징된 파일들 중 TypeScript/JavaScript 파일만 필터링
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' | grep -v 'node_modules' | grep -v '.next')

if [ -z "$STAGED_FILES" ]; then
    echo "📝 No TypeScript/JavaScript files to check."
else
    echo "📝 Running ESLint on staged files..."
    echo "Files to check:"
    echo "$STAGED_FILES"
    
    # 변경된 파일들만 ESLint 실행
    echo "$STAGED_FILES" | xargs npx eslint
    if [ $? -ne 0 ]; then
        echo "❌ ESLint failed on staged files. Please fix the errors before committing."
        exit 1
    fi
    echo "✅ ESLint passed for staged files!"
fi

echo "✅ All pre-commit checks passed!"
EOF

# 실행 권한 부여
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks setup completed!"
echo "📝 Now every commit will automatically run ESLint on staged files only." 