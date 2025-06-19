terraform {
  backend "gcs" {
    bucket = "devpilot-tfstate-jenkins"
    prefix = "jenkins/state"
  }
}
