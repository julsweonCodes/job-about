#!/bin/bash

echo "🔧 Setting up Git hooks for pre-commit checks..."

# Git hooks 디렉토리 생성
mkdir -p .git/hooks

# pre-commit hook 생성
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# ESLint 실행
echo "📝 Running ESLint..."
yarn lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint failed. Please fix the errors before committing."
    exit 1
fi

# TypeScript 타입 체크
echo "🔧 Running TypeScript type check..."
yarn type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript type check failed. Please fix the errors before committing."
    exit 1
fi

echo "✅ All pre-commit checks passed!"
EOF

# 실행 권한 부여
chmod +x .git/hooks/pre-commit

echo "✅ Git hooks setup completed!"
echo "📝 Now every commit will automatically run ESLint and TypeScript checks." 