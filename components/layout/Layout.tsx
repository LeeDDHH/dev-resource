"use strict";

import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { HiHome } from "react-icons/hi";
import { FaThList } from "react-icons/fa";

import HeadComponent from "../HeadComponent";
import styles from "../../styles/Layout.module.css";

const paths = [
  { pathName: "/", component: <HiHome size="2rem" /> },
  { pathName: "/list", component: <FaThList size="1.5rem" /> },
];

type Props = {
  itemsAmount: number;
  children: React.ReactNode;
};

const Layout = React.memo(({ itemsAmount, children }: Props) => {
  const router = useRouter();

  const linkList = useMemo(() => {
    const links = paths.map((path) => {
      return (
        <Link
          key={`link-${path.pathName}`}
          href={path.pathName}
          className={`${styles.iconCenter} ${
            router.asPath === path.pathName ? styles.currentPathColor : styles.selectablePathColor
          }`}
        >
          {path.component}
        </Link>
      );
    });
    return <div className={styles.headerContainer__items}>{links}</div>;
  }, []);

  return (
    <div>
      <header>
        <HeadComponent />
        <div className={styles.headerContainer}>
          <div className={styles.headerContainer__items}>
            開発や学習に役立つ
            <strong>{itemsAmount}</strong>
            個のリソース
          </div>
          {linkList}
        </div>
      </header>
      {children}
    </div>
  );
});

export default Layout;
