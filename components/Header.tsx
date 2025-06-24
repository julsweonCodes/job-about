import React from 'react';

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Header = ({ title, leftIcon, rightIcon }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white flex items-center justify-between px-4 shadow z-50">
      <div className="w-10 flex items-center justify-start">
        {leftIcon}
      </div>
      <div className="flex-1 flex items-center justify-center font-bold text-lg">
        {title}
      </div>
      <div className="w-10 flex items-center justify-end">
        {rightIcon}
      </div>
    </header>
  );
};

export default Header;
