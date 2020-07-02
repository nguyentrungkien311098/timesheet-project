import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Col, Row, Input, Select, Switch } from "antd";
import { connect } from "react-redux";
import actionUsermanager from "@actions/usermanager";
import snackbarUtils from "@utils/snackbar-utils";
import dateUtils from "mainam-react-native-date-utils";
import { AdminPage, Panel } from "@admin/components/admin";

function index(props) {
  const id = props.match.params.id;
}
