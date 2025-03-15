import moment from "moment";

import Logger from "../util/logger.js";
import Validator from "../util/validator.js";

import mysqlClient from "../config/mysql.js";

export default {
  /**
   * Select resource(s)
   * @param {*} req
   * @param {*} res
   * @returns
   */
  select: (req, res) => {
    let message, validation;

    validation = Validator.check([Validator.required(req.body, "query")]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { query } = req.body;

    mysqlClient.getConnection((error, connection) => {
      if (error) {
        message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      }

      connection.query(query, (err, result) => {
        connection.release();

        if (err) {
          message = Logger.message(req, res, 500, "error", err);
          Logger.error([JSON.stringify(message)]);
          return res.json(message);
        }

        message = Logger.message(req, res, 200, "result", result);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      });
    });
  },

  /**
   * Create resource
   * @param {*} req
   * @param {*} res
   * @returns
   */
  create: (req, res) => {
    let message, validation, payload;

    validation = Validator.check([
      Validator.required(req.body, "table"),
      Validator.required(req.body, "data"),
    ]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { table, data } = req.body;

    payload = data;

    let date = moment();
    payload.created_at = date.format("YYYY-MM-DD HH:mm:ss");
    payload.created_at_order = parseInt(date.format("YYYYMMDDHHmmss"));
    payload.updated_at = date.format("YYYY-MM-DD HH:mm:ss");
    payload.updated_at_order = parseInt(date.format("YYYYMMDDHHmmss"));

    mysqlClient.getConnection((error, connection) => {
      if (error) {
        message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      }

      connection.query(
        `INSERT INTO ${table} (${Object.keys(payload)}) VALUES ?`,
        [[Object.values(payload)]],
        (err, result) => {
          connection.release();

          if (err) {
            message = Logger.message(req, res, 500, "error", err);
            Logger.error([JSON.stringify(message)]);
            return res.json(message);
          }

          message = Logger.message(req, res, 200, "result", result);
          Logger.error([JSON.stringify(message)]);
          return res.json(message);
        }
      );
    });
  },

  /**
   * Update resource
   * @param {*} req
   * @param {*} res
   * @returns
   */
  update: (req, res) => {
    let message,
      validation,
      date = moment();

    validation = Validator.check([
      Validator.required(req.body, "table"),
      Validator.required(req.body, "data"),
      Validator.required(req.body, "params"),
    ]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { table, data, params } = req.body;

    data.updated_at = date.format("YYYY-MM-DD HH:mm:ss");
    data.updated_at_order = parseInt(date.format("YYYYMMDDHHmmss"));

    mysqlClient.getConnection((error, connection) => {
      if (error) {
        message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      }

      // Convert data object into a WHERE clause
      let where = Object.entries(params)
        .map(([key]) => `${key} = ?`)
        .join(" AND ");

      connection.query(
        `UPDATE ${table} SET ? WHERE ${where}`,
        [data, ...Object.values(params)],
        (err, result) => {
          connection.release();

          if (err) {
            message = Logger.message(req, res, 500, "error", err);
            Logger.error([JSON.stringify(message)]);
            return res.json(message);
          }

          message = Logger.message(req, res, 200, "result", result);
          Logger.error([JSON.stringify(message)]);
          return res.json(message);
        }
      );
    });
  },

  /**
   * Delete resource
   * @param {*} req
   * @param {*} res
   * @returns
   */
  delete: (req, res) => {
    let message,
      validation,
      date = moment();

    validation = Validator.check([
      Validator.required(req.body, "table"),
      Validator.required(req.body, "params"),
    ]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { table, params } = req.body;

    let data = {
      updated_at: date.format("YYYY-MM-DD HH:mm:ss"),
      updated_at_order: parseInt(date.format("YYYYMMDDHHmmss")),
      deleted_at: date.format("YYYY-MM-DD HH:mm:ss"),
      deleted_at_order: parseInt(date.format("YYYYMMDDHHmmss")),
    };

    mysqlClient.getConnection((error, connection) => {
      if (error) {
        message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      }

      // Convert data object into a WHERE clause
      let where = Object.entries(params)
        .map(([key]) => `${key} = ?`)
        .join(" AND ");

      connection.query(
        `UPDATE ${table} SET ? WHERE ${where}`,
        [data, ...Object.values(params)],
        (err, result) => {
          connection.release();

          if (err) {
            message = Logger.message(req, res, 500, "error", err);
            Logger.error([JSON.stringify(message)]);
            return res.json(message);
          }

          message = Logger.message(req, res, 200, "result", result);
          Logger.out([JSON.stringify(message)]);
          return res.json(message);
        }
      );
    });
  },

  /**
   * Get user details
   * @param {*} req
   * @param {*} res
   * @returns
   */
  user: (req, res) => {
    let message, validation;

    validation = Validator.check([Validator.required(req.body, "query")]);

    if (!validation.pass) {
      message = Logger.message(req, res, 422, "error", validation.result);
      Logger.error([JSON.stringify(message)]);
      return res.json(message);
    }

    const { query } = req.body;

    mysqlClient.getConnection((error, connection) => {
      if (error) {
        message = Logger.message(req, res, 500, "error", error);
        Logger.error([JSON.stringify(message)]);
        return res.json(message);
      }

      connection.query(query, (err, result) => {
        connection.release();

        if (err) {
          message = Logger.message(req, res, 500, "error", err);
          Logger.error([JSON.stringify(message)]);
          return res.json(message);
        }

        message = Logger.message(req, res, 200, "result", result);
        Logger.out([JSON.stringify(message)]);
        return res.json(message);
      });
    });
  },
};
