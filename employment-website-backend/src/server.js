import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

const app = express();
const homepageAdress = 'http://localhost:3000';
// the next line is removed for security reasons
// const serverEmail = ;
const transporter = nodemailer.createTransport({
  host: 'mail.inbox.lv',
  port: '587',
  secure: false,
  auth: {
    user: serverEmail,
    // the next line is removed for security reasons
    // pass:
  }
});

app.use(bodyParser.json());

const withDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017',
      { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('employment-website');

    await operations(db);

    client.close();

  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database', error })
  }
};

const sendEmail = async (email, subject, html) => {
  await transporter.sendMail({
    from: serverEmail,
    to: email,
    subject: subject,
    html: html
  });
};










app.get('/api/vacancies/:jobTitle', async (req,res) => {
  withDB(async (db) => {
    const jobTitle = req.params.jobTitle;

    const jobInfo = await db.collection('vacancies').findOne({ jobTitle: jobTitle });

    res.status(200).json(jobInfo);
  }, res);
});

app.get('/api/seekers/:email', async (req,res) => {
  withDB(async (db) => {
    const email = req.params.email;

    const accountDetails = await db.collection('seekers').findOne({ email: email });

    if (accountDetails === null) {
      res.status(500).json({ message: 'No such email' });
    } else {
      accountDetails.message = 'Success';
      res.status(200).json(accountDetails);
    }
  }, res);
});


app.get('/api/vacancies/delete/:jobTitle', async (req,res) => {
  withDB(async (db) => {
    const jobTitle = req.params.jobTitle;

    await db.collection('vacancies').deleteOne({ jobTitle: jobTitle });

    res.status(200).json({ message: 'Deleted successfully' });
  }, res);
});


app.get('/api/seekers/delete/:email', async (req,res) => {
  withDB(async (db) => {
    const email = req.params.email;

    await db.collection('seekers').deleteOne({ email: email });

    res.status(200).json({ message: 'Deleted successfully' });
  }, res);
});


app.post('/api/vacancies/get-all-vacancies', async (req,res) => {
  withDB(async (db) => {
    const jobs = [];
    await db.collection('vacancies').find({}).forEach((object) => {
      jobs.push(object);
    });
    res.status(200).json(jobs);
  }, res);
});

app.post('/api/seekers/get-all-searching', async (req,res) => {
  withDB(async (db) => {
    const seekers = [];
    await db.collection('seekers').find({ search: '1' }).forEach((object) => {
      seekers.push(object);
    });
    res.status(200).json(seekers);
  }, res);
});


app.post('/api/vacancies/add-new', async (req,res) => {
  withDB(async (db) => {
    if (await db.collection('vacancies').findOne({ jobTitle: req.body.jobTitle}) === null)
    {
      await db.collection('vacancies').insertOne(req.body);

      res.status(200).json(req.body);
    } else {
      res.status(200).json({ message: 'This job name is already taken' });
    }
  }, res);
});

app.post('/api/vacancies/edit', async (req,res) => {
  withDB(async (db) => {
    const body = req.body;
    await db.collection('vacancies').updateOne({ jobTitle: body.jobTitle }, {
      $set: {
        companyName:  body.companyName,
        email: body.email,
        jobType:  body.jobType,
        education: body.education,
        workExperience: body.workExperience,
        skills: body.skills,
        minimumSalary: body.minimumSalary,
        maximumSalary: body.maximumSalary,
        location: body.location,
        description: body.description,
      }
    });
    res.status(200).json({ meesage: 'Edit successful'});
  }, res);
});





app.post('/api/seekers/add-new', async (req,res) => {
  withDB(async (db) => {
    let body = req.body;
    if (await db.collection('seekers').findOne({ email: body.email}) === null)
    {
      body.search = '0';
      body.status = 'unconfirmed';
      body.confirmNumber = (Math.floor((Math.random() * 100) + 54)).toString();

      await db.collection('seekers').insertOne(body);
      const accountDetails = await db.collection('seekers').findOne({ email: body.email });
      const id = accountDetails._id;

      const url = 'http://' + req.get('host') + '/api/confirm-email/' + id + '/' + body.confirmNumber;
      await sendEmail(body.email, 'Confirm Your E-mail', '<p>Hello, <br> Please click the link below to confirm your e-mail: <br>' + url + '</p>');

      res.status(200).json(req.body);
    } else {
      res.status(200).json({ message: 'This email is already taken' });
    }
  }, res);
});

app.post('/api/seekers/edit', async (req,res) => {
  withDB(async (db) => {
    const body = req.body;
    await db.collection('seekers').updateOne({ email: body.email }, {
      $set: {
        firstName: body.firstName,
        surname:  body.surname,
        location: body.location,
        education: body.education,
        workExperience: body.workExperience,
        skills: body.skills,
        salary: body.salary,
        jobType: body.jobType,
      }
    });
    res.status(200).json({ meesage: 'Edit successful'});
  }, res);
});

app.post('/api/seekers/search', async (req,res) => {
  withDB(async (db) => {
    const body = req.body;
    const seekerEmail = body.email;
    const jobs = body.jobs;
    await db.collection('seekers').updateOne({ email: body.email }, {
      $set: {
        search: '1',
      }
    });
    const accountDetails = await db.collection('seekers').findOne({ email: seekerEmail });
    const message = 'Name : ' + accountDetails.firstName + ' ' + accountDetails.surname +
    '<br>Email: ' + accountDetails.email +
    '<br>Education: ' + accountDetails.education + '<br>Work Experience: ' +
    accountDetails.workExperience + '<br>Skills: ' + accountDetails.skills;
    jobs.forEach(async (job) => {
      await sendEmail(job.email, 'Application for ' + job.jobTitle, '<p>' + message + '</p>');
    });
    await sendEmail(seekerEmail, 'Your job search', '<p>Congratulations, your application is sent to ' + jobs.length + ' employers already, and will be sent to any new vacancies that seem to be a good fit for you!<p>');
    res.status(200).json({ meesage: 'Search successful'});
  }, res);
});

app.post('/api/vacancies/search', async (req,res) => {
  withDB(async (db) => {
    const body = req.body;
    const jobTitle = body.jobTitle;
    const seekers = body.seekers;


    const jobInfo = await db.collection('vacancies').findOne({ jobTitle: jobTitle });
    const jobEmail = jobInfo.email;
    seekers.forEach(async (accountDetails) => {
      const message = 'Name : ' + accountDetails.firstName + ' ' + accountDetails.surname +
      '<br>Email: ' + accountDetails.email +
      '<br>Education: ' + accountDetails.education + '<br>Work Experience: ' +
      accountDetails.workExperience + '<br>Skills: ' + accountDetails.skills;
      await sendEmail(jobEmail, 'Application for ' + jobTitle, '<p>' + message + '</p>');
    });
    res.status(200).json({ meesage: 'Search successful'});
  }, res);
});



app.get('/api/confirm-email/:id/:number', async (req,res) => {
  withDB(async (db) => {
    const number = req.params.number;
    const id = req.params.id;
    const objectId = ObjectId(id);

    const accountDetails = await db.collection('seekers').findOne({ _id: objectId });
    if (accountDetails.status === 'unconfirmed') {
      if (accountDetails.confirmNumber === number) {
        await db.collection('seekers').updateOne({ _id: objectId }, {
          $set: {
            status: 'confirmed'
          }
        });
        res.redirect(homepageAdress);
        res.status(200).json({ message: 'Confirmed successfully' });
      } else {
        res.status(500).json({ message: 'Invalid URL' });
      }
    } else {
      res.redirect(homepageAdress);
      res.status(200).json({ message: 'Email is already confirmed' });
    }
  }, res);
});



app.get('/api/submit/:seekerEmail/:jobTitle', async (req,res) => {
  withDB(async (db) => {
    const seekerEmail = req.params.seekerEmail;
    const jobTitle = req.params.jobTitle;

    const jobInfo = await db.collection('vacancies').findOne({ jobTitle: jobTitle });
    const accountDetails = await db.collection('seekers').findOne({ email: seekerEmail });

    const message = 'Name : ' + accountDetails.firstName + ' ' + accountDetails.surname +
    '<br>Email: ' + accountDetails.email +
    '<br>Education: ' + accountDetails.education + '<br>Work Experience: ' +
    accountDetails.workExperience + '<br>Skills: ' + accountDetails.skills;
    await sendEmail(jobInfo.email, 'Application for ' + jobTitle, '<p>' + message + '</p>');

    await sendEmail(seekerEmail, 'Your application for ' + jobTitle, '<p> You have successfully applied for the position ' + jobTitle + '.<p>');

    res.status(200).json({ message: 'Application sent' });
  }, res);
});




app.listen(8000, () => console.log('Listening on port 8000'));
